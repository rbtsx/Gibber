function ScaleSeq(_sequence, _speed) {
	var _sequenceNumbers = ($.isArray(_sequence)) ? _sequence.slice(0) : _sequence.note.slice(0);
	
	if($.isArray(arguments[0]) === true) {
		_sequence = {
			note:_sequence,
		};
		if($.isArray(_speed)) {
			_sequence.durations = _speed;
		}else{
			_sequence.speed = _speed;
		}
	}
	_sequence.doNotAdvance = true; // do not start sequence until scale and pattern has been set.
	
	var that = Seq(_sequence);
	
	that.name = "ScaleSeq";
	that.type = "control";
	
	that.sequenceNumbers = _sequenceNumbers;
	that.mode = that.mode || Gibber.mode;
	that.root = that.root || Gibber.root;
	that.scaleInit = false;
	that.counter = 0;
	
	if(typeof arguments[0] !== "object" && $.isArray(arguments[0]) === true) {
		that.sequence = _sequence;
		that.slaves = [];
	}
	
	that.createPattern = function(sequence) {
		var _rootoctave = this.root.octave;
		this.sequenceNumbers = sequence;
		this.scale = [];

		var _scale = teoria.scale.list(this.root, this.mode, false);

		for(var oct = _rootoctave, o = 0; oct < 8; oct++, o++) {
			for(var num = 0; num < _scale.length; num++) {
				var nt = jQuery.extend({}, _scale[num]);
				nt.octave += o;
				this.scale.push(nt);
			}
		}

		var negCount = -1;
		for(var oct = _rootoctave -1, o = -1; oct >= 0; oct--, o--) {
		 	for(var num = _scale.length - 1; num >= 0; num--) {
		 		var nt = jQuery.extend({}, _scale[num]);
		 		nt.octave += o;
		 		this.scale[negCount--] = nt;
		 	}
		}
		
		this.note = [];
		
		for(var i = 0; i < this.sequenceNumbers.length; i++) {
			if(!$.isArray(this.sequenceNumbers[i])) {
				this.note.push(this.scale[this.sequenceNumbers[i]]);
			}else{
				this.note.push([this.scale[this.sequenceNumbers[i][0]], this.sequenceNumbers[i][1]]);
			}
		}
		
		if($.inArray("note", this.sequences) === -1) {
			this.sequences.push("note");
		}
		
		//this.setSequence(this.sequence);
		if(this.scaleInit === false) {
		 	this.scaleInit = true;
		 	this.memory[0] = this.sequence;
		}
	};
	
	that.set = function(sequence) {
		that.createPattern(sequence);
	};
	
	that.reset = function() {
		that.set(that._sequence);
	};
	// that.reset = function() {
	// 	if(arguments.length === 0) {
	// 		if(that.durations === null) {
	// 			that.setSequence(that.memory[0], that.speed);
	// 		}else{
	// 			that.setSequence(that.memory[0], that.durations);
	// 		}
	// 	}else{
	// 		that.setSequence(that.memory[arguments[0]]);
	// 	}
	// 	return that;
	// };
	
	
	(function(obj) {
	    var root = obj.root;
		var speed = obj.speed;
		var mode = obj.mode;
		var that = obj;
	    Object.defineProperties(that, {
			"root" : {
		        get: function() {
		            return root;
		        },
		        set: function(value) {
		            root = teoria.note(value);
					that.createPattern(that.sequenceNumbers);
		        }
			},
			"mode" : {
		        get: function() {
		            return mode;
		        },
		        set: function(value) {
		            mode = value;
					that.createPattern(that.sequenceNumbers);
		        }
			},
			 
	    });
	})(that);
	
	that.root = that.root || Gibber.root; // triggers meta-setter that sets sequence
	that.counter = 0;

	that.doNotAdvance = false;	
	if(that.slaves.length !== 0) {
		that.advance(); // wait to advance until mode and root have been configured correctly.
	}

	
	return that;
}
