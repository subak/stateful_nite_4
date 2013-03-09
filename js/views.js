(function ( ) {
  Domino.View("Stateful.DomainListView", {
    defaults: {
      tmpl:   "domain_list",
      models: ["domain"]
    }    
  }, { });

  Domino.View("Stateful.DomainListNameView", {
    defaults: {
      tmpl:   "domain_list_name",
      models: ["domain"]
    }
  }, {
    toJson: function ( ) {
      return {
        domain_name: this.domain.name
      };
    }
  });

  Domino.View("Stateful.KingdomListView", {
    defaults: {
      tmpl:    "kingdom_list",
      models:  ["domain", "kingdom"],
    }
  }, { });

  Domino.View("Stateful.KingdomListNameView", {
    defaults: {
      tmpl:    "kingdom_list_name",
      models:  ["domain", "kingdom"]
    }
  }, {
    toJson: function ( ) {
      return {
        domain_name:  this.domain.name,
        kingdom_name: this.kingdom.name
      };
    }
  });

  Domino.View("Stateful.DivisionListView", {
    defaults: {
      tmpl:     "division_list",
      models:   ["domain", "kingdom", "division"]
    }
  }, {
    toJson: function ( ) {
      return {
        domain_name:   this.domain.name,
        kingdom_name:  this.kingdom.name,
        division_name: this.division.name
      };
    }
  });



// TableView
// RowView

})();