define([
    'underscore',
    'views/abstract',
    'collections/conversations',
    'text!templates/messenger/conversations.html',
    'text!templates/messenger/conversation.html'

], function(_, Views, Conversations, MessengerViewTemplate, ConversationViewTemplate) {


    var ConversationView = Views.AbstractView.extend({

        template: _.template(ConversationViewTemplate),

        el: '#conversation-view',

        initialize: function(app, model) {
            Views.AbstractView.prototype.initialize.call(this, app);
            this.model = model;
            console.log(model);

        },

        postRender: function() {
            this.$el.fadeIn();
        }



    });


    var MessengerView = Views.AbstractView.extend({

        template: _.template(MessengerViewTemplate),

        el: '#messenger-view',

        withContext: ['conversations'],

        events: {
            'click .conversation-item': 'toggleConversation'
        },

        initialize: function(app) {
            Views.AbstractView.prototype.initialize.call(this, app);

            this.listenTo(this.app.dispatcher, 'authorized', this.onAuthed.bind(this));
        },


        onAuthed: function(user) {
            this.user = user;
            this.conversations = new Conversations([], this.app);
            this.listenTo(this.conversations, 'sync', this.renderIt);
            this.conversations.fetch();
        },


        postRender: function() {
            this.$el.fadeIn();
        },

        toggleConversation: function(e) {
            window.wtf = this;
            var id = $(e.currentTarget).data('convo'),
                convo = this.conversations.get(id);
            this.addView(new ConversationView(this.app, convo), 'ConversationView').render();
        },



    })


    return MessengerView

})