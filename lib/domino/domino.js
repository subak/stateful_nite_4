(function ( global, $ ) {
  var pubsub = $({});
  $.pubsub = pubsub;

  /**
  @class       View
  @namespace   Domino
  @extends     $.Controller
  */
  $.Controller("Domino.View", {}, {
    init: function (el, opts) {
      var df;
      this.tmpl   = this.options.tmpl
      this.models = this.options.models
      this.models.forEach(function ( name ) {
        this[name] = this.options[name];
      }, this);
      this.load();
      this.bind();
      df = $.Deferred();
      //pubsub.trigger("view:created", [this, df]);
      pubsub.trigger("view.created." + this.constructor.fullName, [this, df]);
      df.done(this.proxy(this.created));
    },
    tmpl_exec: function ( json ) {
      var selector, $tmpl;
      selector = "#tmpl-" + this.tmpl;
      $tmpl = $(selector);
      if ( !$tmpl.length ) { throw new Error(this.constructor.fullName + "#render: could not find the tmpl(" + this.tmpl + ")."); }
      return $tmpl.tmpl(json);
    },
    load: function ( ) {
      //this.element.replaceWith($(this.tmpl_exec(this.toJson())));
      this.element = this.tmpl_exec(this.toJson());
    },
    render: function ( ) {
      this.element.replaceWith(this.tmpl_exec(this.toJson()));
      // var selector, $tmpl;
      // selector = "#tmpl-" + this.tmpl;
      // $tmpl = $(selector);
      // if ( !$tmpl.length ) { throw new Error(this.constructor.fullName + "#render: could not find the tmpl(" + this.tmpl + ")."); }
      // this.element = $tmpl.tmpl(this.toJson());
      //$(this.element).replaceWith($tmpl.tmpl(this.toJson()));
    },
    toJson: function ( ) {
      return {};
    },
    created: function ( point ) {
      switch ( point.method ) {
        case "append":
          $(point.el).append(this.element);
          break;
        case "replace":
          $(point.el).replaceWith(this.element);
          break;
        case "html":
          $(point.el).html(this.element);
          break;
        default:
          throw new Error("Domino.View#created: unknown method " + point.el);
      }
    },
    inTree: function (  ) {
      return $(this.element).parent().length !== 0
    },
    remove: function () {
      this.element.remove();
    },
    like: function ( view ) {
      var i, name;
      for ( i in this.models ) {
        name = this.models[i];
        if ( this[name].id !== view[name].id ) {
          return false;
        }
      }
      return true;
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
    resolveWith: function ( tmpl, views, target, df ) {
      views.forEach(function ( view ) {
        if ( view.like(target) ) { df.resolve(this.entryPoint(tmpl, view)) }
      }, this);
    },
    entryPoint: function ( tmpl, scope ) {
      var el;
      el = this._point(tmpl, this._scope(scope));
      if ( !el ) { throw new Error(this.constructor.fullName + "#entryPoint" + "(" + '"' + tmpl + '"' + ", " + '"' + scope + '"' + ")" + ": can not detect entry point."); }
      return el
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
    _scope: function ( scope ) {
      if ( !scope ) {
        return this.element
      } else if ( scope instanceof Domino.View ) {
        return scope.element
      } else {
        return scope
      }
    }
  });

  /**
  @class     Model
  @namespace Domino
  @extends   $.Model
  */
  $.Model("Domino.Model", {
    
  }, {
    init: function ( ) {
      //pubsub.trigger("model.created", [this]);
      pubsub.trigger("model.created." + this.constructor.fullName, [this]);
    } 
  });
  
  /**
  @class     Collection
  @namespace Domino
  @extends   $.Model.List
  */
  $.Model.List("Domino.Collection");
  
})(window, jQuery);