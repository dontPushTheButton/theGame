module.exports = function honorTheDead() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(name + ' has fallen.  Let us remember.');
        }
    }
}
