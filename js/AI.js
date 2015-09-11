var q = new QLearner(0.8);
localStorage.clear();

var state = function(gm) {
    var cstate = gm.serialize().grid.cells.reduce(function(a,b) {
	return a.concat(b);
    }).map(function(itm) {
	return itm === null ? 0 : itm.value;
    });
    return JSON.stringify(cstate);
}

var step = function(gm) {
    var cstate = state(gm);
    var action = q.bestAction(cstate);
    var raction = Number(~~(Math.random() * 4));
    if (action === null
        || action === undefined
        || (!q.knowsAction(cstate, raction)
            && Math.random()<0.2)) {
        action =  raction;
    }
    var pscore = gm.score;
    gm.move(action);
    var nstate = state(gm);
    var reward;
    if (nstate === cstate) {
	reward = -100;
    } else {
	reward = gm.score - pscore;
    }
    if (!gm.over) {
	q.add(cstate, nstate, reward, action);
	q.learn(10);
    }
}
