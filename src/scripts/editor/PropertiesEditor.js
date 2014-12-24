let $ = require('jquery');
let Signals = require('js-signals');
import Property from '../editor/Property';

let tpl_propertiesEditor = require('./../templates/propertiesEditor.tpl.html');

export default class PropertiesEditor {
  constructor(editor) {
    this.editor = editor;

    this.render = this.render.bind(this);
    this.addProperty = this.addProperty.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onKeyAdded = this.onKeyAdded.bind(this);

    this.timeline = this.editor.timeline;
    this.timer = this.editor.timer;
    this.selectionManager = editor.selectionManager;

    this.$el = $(tpl_propertiesEditor());
    this.$container = this.$el.find('.properties-editor__main');
    // todo: rename keyAdded to updated
    this.keyAdded = new Signals.Signal();
    this.keyRemoved = new Signals.Signal();
    this.items = [];

    // Close properties by default.
    $('body').addClass('properties-is-closed');
    // Add the properties editor to the document.
    $('body').append(this.$el);

    this.selectionManager.onSelect.add(this.onSelect);

    // Stop event propagation to no play by accident.
    this.$el.keypress(function(e) {
      return e.stopPropagation();
    });
  }

  onKeyAdded() {
    this.keyAdded.dispatch();
  }

  onSelect(data = false) {
    this.items.forEach((item) => {item.remove()});
    this.items = [];
    this.$container.empty();
    if (data instanceof Array) {
      for (var i = 0; i < data.length; i++) {
        this.addProperty(data[i]);
      }
    } else {
      this.addProperty(data);
    }

    // When selecting anything, automatically display the properties editor.
    if (this.items.length) {
      $('body').removeClass('properties-is-closed');
    }
  }

  addProperty(data) {
    var prop = new Property(this.editor, this.$container, data);
    prop.keyAdded.add(this.onKeyAdded);
    this.items.push(prop);
  }

  render(time, time_changed) {
    if (!time_changed) {
      return;
    }
    this.items.forEach((prop) => {prop.update()});
  }
}
