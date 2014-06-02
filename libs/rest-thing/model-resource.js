var _ = require('underscore'),
    Resource = require('./resource'),
    Promise = require('bluebird');


var ModelResource = Resource.extend({

    exclude: [],
    hasMany: {},
    hasOne: {},
    belongsTo: {},
    belongsToMany: {},
    filters: [],

    initialize: function(opts) {
        if (_.isString(this.model)) {
            this.model = this.config.models[this.model];
        }
        if (!this.model) throw new Error('No model supplied to model resource!');


    },

    getModel: function(name) {
        return this.config.models[name];
    },


    __relationsFor: function(relationTypes) {
        var related = [];
        _.each(relationTypes, function(resource, key) {
            related.push(key);
            var placeholder = new resource(this._opts);
            related.push.apply(related, placeholder.getRelated().map(function(rel) {
                return key + '.' + rel
            }));
        }, this);
        return related;

    },


    getRelated: function() {
        return this.__relationsFor(this.hasMany)
            .concat(this.__relationsFor(this.hasOne))
            .concat(this.__relationsFor(this.belongsTo))
            .concat(this.__relationsFor(this.belongsToMany));
    },

    __serialize: function(models, req, res) {
        if (_.isArray(models.models)) {
            return this.__dehydrateArray(models, req, res);
        } else {
            return this.__dehydrateModel(models, req, res);
        }
    },

    serializeAsRelated: function(models, req, res) {
        return this.__serialize(models, req, res);
    },


    serialize: function(req, res, models) {
        var that = this;
        this.__serialize(models, req, res).then(function(result) {
            var bundle = {};
            if (_.isArray(result)) {
                bundle[that.name] = result;
                var currentPage = parseInt(req.query.page) || 0;
                bundle.meta = {
                    'count': result.length
                }
                if (result.length === that.pageSize) {
                    bundle.meta.nextUrl = that.apiUrl() + '?page=' + (currentPage + 1);
                    bundle.meta.next = currentPage + 1
                }
                if (currentPage > 0) {
                    bundle.meta.previousUrl = that.apiUrl() + '?page=' + (currentPage - 1);
                    bundle.meta.previous = currentPage - 1;
                }
            } else {
                bundle = result;
            }

            res.json(bundle)
        })
    },


    __dehydrateArray: function(models, req, res) {
        var that = this;
        return Promise.all(models.map(function(model) {
            return that.__dehydrateModel(model, req, res);
        }));

    },


    __serializeRelated: function(relationTypes, model, serialized, req, res) {
        var that = this;
        return _.map(relationTypes, function(resource, relatedName) {
            // ~~* here be dragons *~~
            //Create the resource with the same options as this resource
            //then get the related models via the `relations` hash which should be populated
            //using 'fetchRelated' with the name relatedName 
            //then serialize it, and then put the serialization in the serialized object
            //for this resource, and finally resolve the promise.
            var rez = new resource(that._opts);
            return rez.serializeAsRelated(model.relations[relatedName], req, res)
                .then(function(relatedSerialization) {
                    serialized[relatedName] = relatedSerialization;
                    return Promise.resolve();
                });
        })
    },



    __dehydrateModel: function(model, req, res) {
        var resolver = Promise.defer(),
            that = this,
            serialized = model.toJSON();

        Promise.all(
            this.__serializeRelated(this.hasMany, model, serialized, req, res)
            .concat(this.__serializeRelated(this.hasOne, model, serialized, req, res))
            .concat(this.__serializeRelated(this.belongsTo, model, serialized, req, res))
            .concat(this.__serializeRelated(this.belongsToMany, model, serialized, req, res))
        ).then(function() {
            for (k in that.exclude) {
                delete serialized[that.exclude[k]];
            }
            that.dehydrate(serialized, req, res).then(function(serialized) {
                resolver.resolve(serialized);
            });
        });

        return resolver.promise;
    },

    dehydrate: function(bundle) {
        return Promise.resolve(bundle);
    },

    hydrate: function(body) {
        return new this.model(body);
    },



    buildCollectionQuery: function(req, qb) {
        this.applyFilters(req, qb);
        if (this.pageSize) {
            return qb.limit(this.pageSize).offset((req.query.page * this.pageSize) || 0);
        }
        return qb;
    },

    getCollection: function(req) {
        var that = this;
        return this.model.collection()
            .query(function(qb) {
                that.buildCollectionQuery(req, qb);
            }).fetch({
                withRelated: this.getRelated()
            });
    },



    buildDetailQuery: function(req, qb) {
        this.applyFilters(req, qb);
        var paramName = this.detailParam;
        return qb.where(paramName, req.params[paramName]);
    },

    getDetail: function(req, res) {
        var that = this;
        console.log("WTF???")
        return new this.model({})
            .query(function(qb) {
                console.log("BEFORE QB")
                qb = that.buildDetailQuery(req, qb);
                console.log("QBBBBBBBBB");
                return qb;
            })
            .fetch()
            .tap(function(model) {
                return model.load(that.getRelated());
            });
    },



    applyFilters: function(req, qb) {
        _.each(this.filters, function(filter) {
            if (req.query[filter]) {
                qb.where(filter, req.query[filter]);
            }

        }, this);
        return qb;
    },


    onListGet: function(req, res) {
        var that = this;
        this.getCollection(req).then(function(models) {
            that.serialize(req, res, models);
        }).
        catch(_.partial(that.onError, req, res))


    },

    onListPost: function(req, res) {
        var that = this,
            newModel = this.hydrate(req.body, req, res);
        newModel.save().tap(function(model) {
            return model.load(that.getRelated());
        }).then(function(model) {
            newModel.fetch().then(function(model) {
                that.serialize(req, res, model);
            }).
            catch(_.partial(that.onError, req, res));
        }).
        catch(_.partial(that.onError, req, res));
    },

    onListPut: function(req, res) {

    },

    onListDelete: function(req, res) {

    },



    onDetailGet: function(req, res) {
        var that = this;
        this.getDetail(req, res)
            .then(
                function(model) {
                    that.serialize(req, res, model);
                }
        ).
        catch(_.partial(that.onError, req, res));
    },

    onDetailPost: function(req, res) {
        var whereClause = this.buildDetailQuery(req),
            fields = this.hydrate(req.body, req, res).toJSON(),
            that = this;
        new this.model(whereClause).fetch().then(
            function(model) {
                that.serialize(req, res, model);
            }, function(err) {
                res.json(404, err)
            }
        );
    },

    onDetailPut: function(req, res) {
        var whereClause = this.buildDetailQuery(req),
            fields = this.hydrate(req.body, req, res).toJSON(),
            that = this;

        new this.model(whereClause).save(fields, {
            patch: true
        }).then(
            function(model) {
                that.serialize(req, res, model);
            }, function(err) {
                res.json(404, err)
            }
        );
    },

    onDetailDelete: function(req, res) {
        var whereClause = this.buildDetailQuery(req),
            fields = req.body,
            that = this;
        new this.model(whereClause).save(fields, {
            patch: true
        }).then(
            function(model) {
                that.serialize(req, res, model);
            }, function(err) {
                res.json(404, err)
            }
        );
    },


});



module.exports = ModelResource;