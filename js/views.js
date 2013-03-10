(function ( ) {
  Domino.View("Stateful.View", { }, {
    "{domain} destroyed": function ( ) { 
      if ( this.inTree() ) { this.remove(); }
    },
    "{kingdom} destroyed": function ( ) {
      if ( this.inTree() ) { this.remove(); }
    },
    "{division} destroyed": function ( ) {
      if ( this.inTree() ) { this.remove(); }
    }
  });
  
  Stateful.View("Stateful.DomainListView", {
    defaults: {
      tmpl:   "domain_list",
      models: ["domain"]
    }
  }, { });

  Stateful.DomainListView("Stateful.DomainListNameView", {
    defaults: {
      tmpl:         "domain_list_name",
      dataBindings: ["domain"],
    }
  }, {
    toJson: function ( ) {
      return {
        domain_name: this.domain.name
      };
    }
  });

  Stateful.View("Stateful.KingdomListView", {
    defaults: {
      tmpl:    "kingdom_list",
      models:  ["domain", "kingdom"],
    }
  }, { });

  Stateful.KingdomListView("Stateful.KingdomListNameView", {
    defaults: {
      tmpl: "kingdom_list_name"
    }
  }, {
    toJson: function ( ) {
      return {
        domain_name:  this.domain.name,
        kingdom_name: this.kingdom.name
      };
    },
    "{domain} updated.attr": function ( ) { this.render(); },
    "{kingdom} updated.attr": function ( ) { this.render(); }
  });

  Stateful.View("Stateful.DivisionListView", {
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
    },
    "{domain} updated.attr": function ( ) { this.render(); },
    "{kingdom} updated.attr": function ( ) { this.render(); },
    "{division} updated.attr": function ( ) { this.render(); }
  });



// TableView
// RowView

})();