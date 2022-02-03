const app = Vue.createApp({
  compilerOptions: {
    delimiters: ["[[", "]]"]
  },
  data() {
    return {
      note: {
        noteid: '',
        title: '',
        body: '',
        updateDate: '',
        editStatus: false,
      },
      newnote: {
        noteid: '',
        title: '',
        body: '',
        updateDate: '',
        editStatus: false,
      },
      notes: [
        {
          noteid: '01010011',
          title: 'demo title',
          body: 'demo body',
          updateDate: 'demo date',
          editStatus: false,
        }
      ]
    };
  },
  mounted: function () {
    this.initNote();
  },
  methods: {
    display(value) {
      console.log(value);
    },
    getIdbyIndex (index) {
      if (index==-1) {
        return this.newnote.noteid;
      } else {
        return this.notes[index].noteid;
      }
    },
    initNote () {
      for (const note of this.notes) {
        if (sessionStorage.getItem(note.noteid)) {
          const savenote = JSON.parse(sessionStorage.getItem(note.noteid));
          note.title = savenote.title;
          note.body = savenote.body;
          note.updateDate = savenote.udpateDate;
        }
      }
    },
    existTemp (index) {
      var noteid;
      if (index==-1) {
        noteid = this.newnote.noteid;
      } else {
        noteid = this.notes[index].noteid;
      }
      console.log(noteid);
      if (sessionStorage.getItem(noteid)) {
        console.log('yes');
        return true;
      } else {
        console.log('no');
        return false;
      }
    },
    saveTempTitle (value, initialValue, index) {
      const date = new Date();
      var body, noteid;
      if (index==-1) {
        this.newnote.editStatus = true;
        body = this.newnote.body;
        noteid = this.newnote.noteid;
      } else {
        this.notes[index].editStatus = true;
        body = this.notes[index].body;
        noteid = this.notes[index].noteid;
      }
      sessionStorage.setItem(noteid, JSON.stringify({
        title: value,
        body: body,
        updateDate: date.getTime()
      }));
    },
    saveTempBody (value, initialValue, index) {
      const date = new Date();
      var title, noteid;
      if (index==-1) {
        this.newnote.editStatus = true;
        title = this.newnote.title;
        noteid = this.newnote.noteid;
      } else {
        this.notes[index].editStatus = true;
        title = this.notes[index].title;
        noteid = this.notes[index].noteid;
      }
      sessionStorage.setItem(noteid, JSON.stringify({
        title: title,
        body: value,
        updateDate: date.getTime()
      }));
    },
    loadTemp (index) {
      var noteid;
      if (index==-1) {
        noteid = this.newnote.noteid;
      } else {
        noteid = this.notes[index].noteid;
      }

      return JSON.parse(sessionStorage.getItem(noteid));
    },
    newNote() {
      let {
        title,
        body
      } = this.newnote;
      
      this.notes.push({
        title,
        body
      });
      
      this.newnote.title = "New Title";
      this.newnote.body = "New Note";

    },
    removeNote(index) {
      this.notes.splice(index, 1);
    },
  },
});

app.use(Quasar, { config: {} });
app.mount("#q-app");
