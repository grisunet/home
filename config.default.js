var config = {};

config.bosh = {
	url: 'http://URL_TO_SYSAP:5280/http-bind',
	jid: 'JID@busch-jaeger.de',
	resource: 'nodeapi',
	password: 'PASSWORD'
};

config.websocket = {
	url: 'ws://URL_TO_SYSAP:5280/xmpp-websocket/',
	jid: 'JID@busch-jaeger.de',
	resource: 'nodeapi',
	password: 'PASSWORD'
};

module.exports = config;