function PlayerEdit(name, index) {
  this.name = name || '';
  this.previousName = this.name;
  this.index = index || 0;
}

module.exports = PlayerEdit;
