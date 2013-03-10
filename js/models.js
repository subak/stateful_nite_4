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
  }, {
    forEach: function ( callback, thisArg ) {
      Array.prototype.forEach.apply(this, [callback, thisArg]);
    }
  });

  Stateful.Collection("Stateful.DomainCollection", {
    defaults: {
      klass: Stateful.DomainModel
    },
    fetch: function () {
      return this.fetchWith(Stateful.DomainModel, [{ id: 1, name: "1年" }, { id: 2, name: "2年" }]);
    }
  }, { });
   
  Stateful.Collection("Stateful.KingdomCollection", {
    defaults: {
      klass: Stateful.KingdomModel
    },
    fetch: function () {
      return this.fetchWith(Stateful.KingdomModel, [{ id: 1, name: "1組", domainId: 1 }, { id: 2, name: "2組", domainId: 2 }]);
    }
  }, { });
   
  Stateful.Collection("Stateful.DivisionCollection", {
    defaults: {
      klass: Stateful.DivisionModel
    },
    fetch: function () {
      return this.fetchWith(Stateful.DivisionModel, [{id: 1, name: "1番　あ", kingdomId: 1 }, { id: 2, name: "2番 い", kingdomId: 2 }]);
    }
  }, { });

})();