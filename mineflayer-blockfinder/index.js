var assert = require('assert');
var fs = require('fs');
var abs = Math.abs;

module.exports = init;

var MAX_CPU_SPIN = 10;
var vec3=require('vec3');

function init() {

    function inject(bot) {

        var unit = [
            vec3(-1,  0,  0),
            vec3( 1,  0,  0),
            vec3( 0,  1,  0),
            vec3( 0, -1,  0),
            vec3( 0,  0,  1),
            vec3( 0,  0, -1),
        ];

        var zeroed = [
            vec3(0, 1, 1),
            vec3(0, 1, 1),
            vec3(1, 0, 1),
            vec3(1, 0, 1),
            vec3(1, 1, 0),
            vec3(1, 1, 0),
        ];

        function CubeIterator(center) {
            this.center = center.floored();
            this.apothem = 1;
            this.side = 0;
            this.point = vec3(0, 0, -1);
            this.max = zeroed[this.side].scaled(2 * this.apothem);
            if (this.max.y > 255) {
                this.max.y = 255;
            } else if (this.max.y < 0) {
                this.max.y = 0;
            }
        }

        CubeIterator.prototype.next = function() {
            this.point.z += 1;
            if (this.point.z > this.max.z) {
                this.point.z = 0;
                this.point.y += 1;
                if (this.point.y > this.max.y) {
                    this.point.y = 0;
                    this.point.x += 1
                    if (this.point.x > this.max.x) {
                        this.point.x = 0;
                        this.side += 1;
                        if (this.side >= 6) {
                            this.side = 0;
                            this.apothem += 1;
                        }
                        this.max = zeroed[this.side].scaled(2 * this.apothem);
                        if (this.max.y > 255) {
                            this.max.y = 255;
                        } else if (this.max.y < 0) {
                            this.max.y = 0;
                        }
                    }
                }
            }
            var offset = this.point.minus(this.max.scaled(0.5).floored()).plus(unit[this.side].scaled(this.apothem));
            var abs_coords = this.center.plus(offset);
            return abs_coords;

        }

        var newBlockMap = {};

        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                for (var z = -1; z <= 1; z++) {
                    var directions = [];
                    if (x) {
                        directions.push(vec3(x, 0, 0));
                    } else {
                        directions.push(vec3(1, 0, 0));
                        directions.push(vec3(-1, 0, 0));
                    }
                    if (y) {
                        directions.push(vec3(0, y, 0));
                    } else {
                        directions.push(vec3(0, 1, 0));
                        directions.push(vec3(0, -1, 0));
                    }
                    if (z) {
                        directions.push(vec3(0, 0, z));
                    } else {
                        directions.push(vec3(0, 0, 1));
                        directions.push(vec3(0, 0, -1));
                    }
                    newBlockMap[vec3(x, y, z)] = directions;
                }
            }
        }

        function vec3Sign(vec) {
            var x = vec.x,
                y = vec.y,
                z = vec.z;

            if (x < 0) x = -1;
            else if (x > 0) x = 1;
            if (y < 0) y = -1;
            else if (y > 0) y = 1;
            if (z < 0) z = -1;
            else if (z > 0) z = 1;

            return vec3(x, y, z);
        }

        function NeighborIterator(center) {
            this.center = center.floored();
            this.closedSet = { // All blocks that are this.distance blocks away
                center: this.center,
            };
            this.openSet = {}; // When a block in the closedSet is checked, its adjacent neighbors are added to the openSet (the ones that do not lead back to the center).
            this.distance = 0;
        }

        NeighborIterator.prototype.next = function() {
            // Get first item in closedSet
            for (var key in this.closedSet) break;

            if (key == null) {
                // We have exhausted all blocks within this.distance of this.center.
                this.closedSet = this.openSet;
                this.openSet = {};
                for (key in this.closedSet) break;
                this.distance++;
            }

            var point = this.closedSet[key];
            delete this.closedSet[key];
            if (point == null) {
                // Should never happen
                assert(false);
                return null;
            }

            // Add all adjacent blocks that do not lead back to center to the open set
            var distanceSigned = vec3Sign(point.minus(this.center));
            var directions = newBlockMap[distanceSigned];
            for (var i = 0; i < directions.length; i++) {
                var offset = point.plus(directions[i]);
                if (offset.y < 0 || offset.y > 255) continue;
                this.openSet[offset] = offset;
            }
            return point;
        }

        function OctahedronIterator(center) {
            this.center = center.floored();
            this.apothem = 1;
            this.x = -1;
            this.y = -1;
            this.z = -1;
            this.L = this.apothem;
            this.R = this.L + 1;
        }

        OctahedronIterator.prototype.next = function() {
            this.R -= 1;
            if (this.R < 0) {
                this.L -= 1;
                if (this.L < 0) {
                    this.z += 2;
                    if (this.z > 1) {
                        this.y += 2;
                        if (this.y > 1) {
                            this.x += 2;
                            if (this.x > 1) {
                                this.apothem += 1;
                                this.x = -1;
                            }
                            this.y = -1;
                        }
                        this.z = -1;
                    }
                    this.L = this.apothem;
                }
                this.R = this.L;
            }
            var X = this.x * this.R;
            var Y = this.y * (this.apothem - this.L);
            var Z = this.z * (this.apothem - abs(abs(X) + abs(Y)));
            var offset = vec3(X, Y, Z);
            var point = offset.plus(this.center);
            return point;
        }

        function createBlockTypeMatcher(blockType) {
            return function(block) {
                return block == null ? false : blockType === block.type;
            };
        }

        function createBlockArrayMatcher(blockArray) {
            return function(block) {
                return block == null ? false : blockArray.indexOf(block.type) !== -1;
            };
        }

        function createBlockMapMatcher(blockTypeMap) {
            return function(block) {
                return block == null ? false : blockTypeMap[block.type];
            };
        }

        function predicateFromMatching(matching) {
            if (typeof(matching) === 'number') {
                return createBlockTypeMatcher(matching)
            } else if (typeof(matching) === 'function') {
                return matching;
            } else if (Array.isArray(matching)) {
                return createBlockArrayMatcher(matching);
            } else if (typeof(matching) === 'object') {
                return createBlockMapMatcher(matching);
            } else {
                // programmer error. crash loudly and proudly
                throw new Error("Block Finder: Unknown value for matching: " + matching);
            }
        }

        function optionsWithDefaults(options) {
            assert.notEqual(options.matching, null);
            assert.notEqual(options.point, null);
            return {
                point: options.point,
                matching: options.matching,
                count: options.count == null ? 1 : options.count,
                maxDistance: options.maxDistance == null ? 64 : options.maxDistance,
                predicate: predicateFromMatching(options.matching),
            };
        }

        bot.findBlock = findBlock;
        bot.findBlockSync = findBlockSync;

        function findBlockSync(options) {
            options = optionsWithDefaults(options);

            var it = new OctahedronIterator(options.point);
            var result = [];

            while (result.length < options.count && it.apothem <= options.maxDistance) {
                var block = bot.blockAt(it.next());
                if (options.predicate(block)) result.push(block);
            }

            return result;
        }

        function findBlock(options, callback) {
            options = optionsWithDefaults(options);

            var it = new OctahedronIterator(options.point);
            
            var result = [];
            setImmediate(function() {
                while (result.length < options.count && it.apothem <= options.maxDistance) {
                    var block = bot.blockAt(it.next());
                    
                    if (options.predicate(block)) result.push(block);
                }
                return callback(null, result);
            });
        }
        
    }
    return inject;
}
