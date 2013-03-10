(function ( global, $ ) {
  var pubsub = $({});
  $.pubsub = pubsub;

  /**
  @class       View
  @namespace   Domino
  @extends     $.Controller
  */
  $.Controller("Domino.View", {
    defaults: {
      tmpl:         null,
      models:       [],
      dataBindings: []
    },
    entryPoint: function ( tmpl, scope ) {
      var el;
      el = this._point(tmpl, this._scope(scope));
      if ( !el ) { throw new Error(this.constructor.fullName + "#entryPoint" + "(" + '"' + tmpl + '"' + ", " + '"' + scope + '"' + ")" + ": can not detect entry point."); }
      return el
    },
    _el: function ( method, tmpl, scope ) {
      var el;
      if ( scope.is("[data-" + method + "='" + tmpl + "']") ) {
        return scope;
      } else if ( el = scope.find("[data-" + method + "='" + tmpl + "']"), el.length ) {
        return el;
      } else {
        return [];
      }
    },
    _scopeToContext: function ( opts, scope ) {
      var i=0, view;
      if ( scope instanceof Array ) {
        while ( view = scope[i++] ) {
          if ( view.createdWith(opts) ) {
            return view.element;
          }
        }
      } else if ( scope instanceof Domino.Controller ) {        
        return scope.element;
      } else if ( scope instanceof Domino.View ) {
        return scope.element;
      }
      
      throw new Error(this.fullName + "._scopeToContext: " + "could not detect context.");
    },
    _point: function ( tmpl, scope ) {
      var i, methods, method, el;
      methods = ["append", "html", "replace"];
      for ( i in methods ) {
        method = methods[i];
        el = this._el(method, tmpl, scope);
        if ( el.length >= 1 ) {
          return {
            el:     el,
            method: method
          }
        }
      }
      throw new Error(this.fullName + "._point:(" + '"' + tmpl + '"' +") " + "could not detect point.");
    },
    _registerTree: function ( target, anchor, method ) {
      if ( method === "append" ) {
        $(anchor).append(target);
      } else if ( method === "replace" ) {
        $(anchor).replaceWith(target);
      } else if ( method === "html" ) {
        $(anchor).html(target);
      } else {
        throw new Error(this.fullName + "._registerTree:");
      }
    },
    create: function ( opts, scope ) {
      var df, context, point, $el, view;
      var df = $.Deferred();
      context = this._scopeToContext(opts, scope);
      point = this._point(this.defaults.tmpl, context);    
      $el = $("<div>");
      this._registerTree($el, point.el, point.method);
      view = new this($el, opts);

      df.resolve(view);
      return df.promise();
    }
  }, {
    init: function (el, opts) {
      // this.tmpl         = this.options.tmpl
      // this.models       = this.options.models  
      // this.dataBindings = this.options.dataBindings
      // this.models.forEach(function ( name ) {
      //   this[name] = this.options[name];
      // }, this);
      
      $.extend(this, this.options);
      //this._rebind();
//      this.render();
    },
    createdWith: function ( opts ) {
      var i, name;
      for ( i in this.models ) {
        model_name = this.models[i];
        if ( opts[model_name].id !== this[model_name].id ) {
          return false;
        }
      }
      return true;
    },
    _rebind: function ( ) {
      this._unbind();
      this._registerDataBindings();
      this.bind();
    },
    _registerDataBindings: function ( ) {
      this.dataBindings.forEach(function ( model_name ) {
        actions = { }
        actions["{" + model_name + "} updated.attr"] = function ( ) {
          debugger
          this.render();
        }
        actions["{" + model_name + "} destroyed"] = function ( ) {
          debugger
          if ( this.inTree() ) { this.remove(); }
        }
        for ( action in actions ) {
          this.constructor.actions[action] = null;
          this[action] = this.proxy(actions[action]);
        }
      }, this);      
    },
    render: function ( ) {
      $el = $("#tmpl-" + this.tmpl).tmpl(this.toJson());
      this._unbind();
      $(this.element).replaceWith($el);
      this.element = $el;
      this._registerDataBindings();
      this.bind();
      return this;
    },
    toJson: function ( ) {
      return {};
    },
    inTree: function (  ) {
      return $(this.element).parent().length !== 0
    },
    remove: function () {
      if ( this.inTree() ) { this.element.remove(); }
    },
    "{element} destroyed": function ( el, event ) {
      pubsub.trigger("view.destroyed." + this.constructor.fullName, [this]);
    }
  });

  /**
  @class       Controller
  @namespace   Domino
  @extends     $.Controller
  */
  $.Controller("Domino.Controller", {}, {
    init: function ( el, opts ) {
      $.extend(this, this.options);
    },
    rebind: function (  ) {
      this._unbind();
      this.bind();
    },
    spliceViews: function ( views, opts ) {
      var i = 0, _views = [];
      while ( view = views[i++] ) {
        if ( !view.createdWith(opts) ) {
          _views.push(view);
        }
      }
      views = _views;
    }
  });

  /**
  @class     Model
  @namespace Domino
  @extends   $.Model
  */
  $.Model("Domino.Model", {
    create: function ( data, b, c, d, e ) {
      return $.Deferred().done(this.proxy(function ( model ) {
        $.event.trigger("created", model, this, true)
      })).resolve(new this(data));
    },
    update: function ( id, data, success, error ) {
      return $.Deferred().resolve();
      //return $.Deferred().done(success).fail(error).resolve();
    },
    destroy: function ( id, success, error ) {
      //return $.Deferred().resolve();
      return $.Deferred().done(success).fail(error).resolve();
    }
  }, { });
  
  /**
  @class     Collection
  @namespace Domino
  @extends   $.Model.List
  */
  $.Model.List("Domino.Collection", {
    fetchWith: function ( klass, datas ) {
      var df, models = [], i, collection;
      df = $.Deferred();
      for ( i in datas ) { models.push(new klass(datas[i])); }
      collection = new this(models);
      
      klass.bind("created", collection.proxy(function ( e, model ) {
        this.push(model);
      }));
//      klass.bind("destroyed", collection.proxy(function ( e, model ) {
//        this.remove(model.id);
//      }));

      df.resolve(collection);
      return df.promise();
    }
  }, { });
  
})(window, jQuery);