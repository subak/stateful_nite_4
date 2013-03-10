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
    "{$.pubsub} ready.stateful": function ( o, e, domains, kingdoms, divisions ) {
      this.domains   = domains;
      this.kingdoms  = kingdoms;
      this.divisions = divisions;
      this.rebind();
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
      Stateful.DomainListView.create({domain: domain}, this).done(this.proxy(function ( view ) {
        this.domainListViews.push(view.render());
        Stateful.DomainListNameView.create({domain: domain}, this.domainListViews).done(this.proxy(function ( view ) {
          this.domainListNameViews.push(view.render());
        }));
      }));
    },
    
    addKingdomView: function ( domain, kingdom ) {
      Stateful.KingdomListView.create({
        domain:  domain,
        kingdom: kingdom
      }, this.domainListViews).done(this.proxy(function ( view ) {
        this.kingdomListViews.push(view.render());
        Stateful.KingdomListNameView.create({
          domain:  domain,
          kingdom: kingdom
        }, this.kingdomListViews).done(this.proxy(function ( view ) {
          this.kingdomListNameViews.push(view.render());
        }));
      }));
    },
    
    addDivisionView: function ( domain, kingdom, division ) {
      Stateful.DivisionListView.create({
        domain:   domain,
        kingdom:  kingdom,
        division: division
      }, this.kingdomListViews).done(this.proxy(function ( view ) {
        this.divisionListViews.push(view.render());
      }));
    },
    
    "{domains} add": function ( o, e, models ) {
      var domain = models[0];
      this.addDomainView(domain);
    },

    "{kingdoms} add": function ( o, e, models ) {
      var kingdom = models[0];
      var domain  = this.domains.get(kingdom.domainId)[0];
      this.addKingdomView(domain, kingdom);
    },
    
    "{divisions} add": function ( o, e, models ) {
      var division = models[0],
        kingdom = this.kingdoms.get(division.kingdomId)[0];
        domain = kingdom ? this.domains.get(kingdom.domainId)[0] : undefined;
      this.addDivisionView(domain, kingdom, division);
    },

    "{domains} remove": function ( o, e, models ) {
      var domain = models[0], opts = {domain: domain};
      this.spliceViews(this.domainListViews, opts);
      this.spliceViews(this.domainListNameViews, opts);
      this.spliceViews(this.kingdomListViews, opts);
      this.spliceViews(this.kingdomListNameViews, opts);
      this.spliceViews(this.divisionListViews, opts);
    },

    "{kingdoms} remove": function ( o, e, models ) {
      var kingdom = models[0],
        domain = this.domains.get(kingdom.domainId)[0],
        opts = { domain: domain, kingdom: kingdom }
      this.spliceViews(this.kingdomListViews, opts);
      this.spliceViews(this.kingdomListNameViews, opts);
      this.spliceViews(this.divisionListViews, opts);
    },
   
    "{divisions} remove": function ( o, e, models ) {
      var division = models[0],
        kingdom = this.kingdoms.get(division.kingdomId),
        domain = kingdom ? this.domains.get(kingdom.domainId) : undefined,
        opts = { domain: domain, kingdom: kingdom, division: division }
      this.spliceViews(this.divisionListViews, opts);
    }
  });
})();