const app = Vue.createApp({
  compilerOptions: {
    delimiters: ["[[", "]]"]
  },
  data() {
    return {
      note: {
        title: '',
        text: ''
      },
      newnote: {
        title: 'New Title',
        body: 'New Note',
        author: 'You'
      },
      notes: []
    };
  },
  methods: {
    newNote() {
      let {
        // this.newnote.title,
        // this.newnote.body,
        // this.newnote.author
        title,
        body,
        author
      } = this.newnote
      
      this.notes.push({
        title,
        body,
        author
      });
      
      this.newnote.title = "New Title";
      this.newnote.body = "New Note";
      this.newnote.author = "";
    },
    removeNote(index) {
      this.notes.splice(index, 1);
    },
  },
});

app.use(Quasar, { config: {} });
app.mount("#q-app");
