(function ( ) {
  Domino.Model("Stateful.DomainModel", {
    defaults: {
      id:   null,
      name: null
    }
  }, { }); 

  Domino.Model("Stateful.KingdomModel", {
    defaults: {
      id:       null,
      name:     null,
      domainId: null,
    }
  }, { });

  Domino.Model("Stateful.DivisionModel", {
    defaults: {
      id:        null,
      name:      null,
      kingdomId: null,
    }
  }, { });

  Domino.Collection("Stateful.Collection", {
    fetchWith: function ( klass, datas ) {
      var df, models = [], i;
      df = $.Deferred();
      for ( i in datas ) { models.push(new klass(datas[i])); }
      df.resolve(new this(models));
      return df.promise();
    }
  }, {
    forEach: function ( callback, thisArg ) {
      Array.prototype.forEach.apply(this, [callback, thisArg]);
    }
  });

  Stateful.Collection("Stateful.DomainCollection", {
    fetch: function () {
      return this.fetchWith(Stateful.DomainModel, [{ id: 1, name: "1年" }, { id: 2, name: "2年" }]);
    }
  }, {
    "{$.pubsub} model.created.Stateful.DomainModel": function ( o, e, model ) {
      this.push(model);
    }
  });
   
  Stateful.Collection("Stateful.KingdomCollection", {
    fetch: function () {
      return this.fetchWith(Stateful.KingdomModel, [{ id: 1, name: "1組", domainId: 1 }, { id: 2, name: "2組", domainId: 2 }]);
    }
  }, {
    "{$.pubsub} model.created.Stateful.KingdomModel": function ( o, e, model ) {
      this.push(model);
    }
  });
   
  Stateful.Collection("Stateful.DivisionCollection", {
    fetch: function () {
      return this.fetchWith(Stateful.DivisionModel, [{id: 1, name: "1番　あ", kingdomId: 1 }, { id: 2, name: "2番 い", kingdomId: 2 }]);
    }
  }, {
    "{$.pubsub} model.created.Stateful.DivisionModel": function ( o, e, model ) {
      this.push(model);
    }
  });

})();