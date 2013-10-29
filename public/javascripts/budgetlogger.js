var budgetLogger = {
	level : 0,
	setLevel : function(newLevel) {
		if(newLevel === 'off') {
			this.level = 0;
		} else if(newLevel === 'debug') {
			this.level = 1;
		} else if(newLevel === 'error') {
			this.level = 2;
		} else if(newLevel === 'trace') {
			this.level = 3;
		}
	},
	log : function(logMessage) {
		if(this.level > 0) {
			this.oldConsole.log(logMessage);
		}
	},
	error : function(logMessage) {
		if(this.level > 0) {
			this.oldConsole.error(logMessage);
		}
	},
	debug : function(logMessage) {
		if(this.level > 0) {
			this.oldConsole.debug(logMessage);
		}
	},
	init : function() {
		this.oldConsole = console;
		console = this;
	}
};
//budgetLogger.init();