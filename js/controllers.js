(function ( ) {
  Domino.Controller("Stateful.ListController", {
    defaults: {
      domainListViews:       [],
      domainListNameViews:   [],
      kingdomListViews:      [],
      kingdomListNameViews:  [],
      divisionListViews:     []
    }
  }, {
    "{$.pubsub} stateful.ready": function ( o, e, domains, kingdoms, divisions ) {    
      this.domains   = domains;
      this.kingdoms  = kingdoms;
      this.divisions = divisions;
      this.bind();

      this.domains.forEach(function ( domain ) {
        this.addDomainView(domain);
        this.kingdoms.match("domainId", domain.id).forEach(function ( kingdom ) {
          this.addKingdomView(domain, kingdom);
          this.divisions.match("kingdomId", kingdom.id).forEach(function ( division ) {
            this.addDivisionView(domain, kingdom, division);
          }, this);
        }, this);
      }, this);
    },
    addDomainView: function ( domain ) {
      this.domainListViews.push(new Stateful.DomainListView($("<div>"), { domain: domain }));
      this.domainListNameViews.push(new Stateful.DomainListNameView($("<div>"), { domain: domain }));      
    },
    addKingdomView: function ( domain, kingdom ) {
      this.kingdomListViews.push(new Stateful.KingdomListView($("<div>"), {
        domain:  domain,
        kingdom: kingdom
      }));
      this.kingdomListNameViews.push(new Stateful.KingdomListNameView($("<div>"), {
        domain:  domain,
        kingdom: kingdom
      }));
    },
    addDivisionView: function ( domain, kingdom, division ) {
      this.divisionListViews.push(new Stateful.DivisionListView($("<div>"), {
        domain:   domain,
        kingdom:  kingdom,
        division: division,
      }));      
    },
    "{domains} add": function ( o, e, models ) {
      this.addDomainView(models[0]);
    },
    "{kingdoms} add": function ( o, e, models ) {
      var kingdom = models[0];
      var domain  = this.domains.get(kingdom.domainId)[0];
      this.addKingdomView(domain, kingdom);
    },
    "{divisions} add": function ( o, e, models ) {
      var division = models[0];
      var kingdom  = this.kingdoms.get(division.kingdomId)[0];
      var domain   = kingdom ? this.domains.get(kingdom.domainId)[0] : undefined;
      this.addDivisionView(domain, kingdom, division);
    },
    "{$.pubsub} view.created.Stateful.DomainListView": function ( o, e, view, df ) {
      df.resolve(this.entryPoint("domain_list"));
    },
    "{$.pubsub} view.created.Stateful.DomainListNameView": function ( o, e, view, df ) {
      this.resolveWith("domain_list_name", this.domainListViews, view, df);
    },
    "{$.pubsub} view.created.Stateful.KingdomListView": function ( o, e, view, df ) {
      this.resolveWith("kingdom_list", this.domainListViews, view, df);
    },
    "{$.pubsub} view.created.Stateful.KingdomListNameView": function ( o, e, view, df ) {
      this.resolveWith("kingdom_list_name", this.kingdomListViews, view, df);
    },
    "{$.pubsub} view.created.Stateful.DivisionListView": function ( o, e, view, df ) {
      this.resolveWith("division_list", this.kingdomListViews, view, df);
    }
  });
})();