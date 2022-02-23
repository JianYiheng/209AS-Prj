const app = Vue.createApp({
  compilerOptions: {
    delimiters: ["[[", "]]"]
  },
  data() {
    return {
      keyword: {
        name: '',
        num: ''
      },
      keywords: [],
      newnote: {
        noteId: '',
        title: 'New Note Title',
        body: 'New Note Text',
        keywords: '',
        updateDate: '',
        editStatus: false,
      },
      note: {
        noteId: '',
        title: '',
        body: '',
        keywords: '',
        updateDate: '',
        editStatus: false,
      },
      notes: []
    };
  },
  mounted: function () {
    this.getAllKw();
    this.getAllNotes();
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
    recoverCache()
    {
      var storage=window.localStorage;
      for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i); //获取本地存储的Key
    
      this.notes.push({
          title:key,
          body: localStorage.getItem(key)
        });
      }
    },

    getAllKw () {
      axios({
        method: 'get',
        url: '/getKw'
      })
      .then(function (response) {
        this.keywords = response.data;
      })
      .catch(function (error) {
        // alert(error.data);
      })
    },
    getAllNotes () {
      axios({
        method: 'get',
        url: '/getNote',
        params: 0
      })
      .then(function (response) {
        this.notes = response.data;
      })
      .catch(function (error) {
        // alert(error.data);
      })
    },
    selectByKw (kw) {
      axios({
        method: 'post',
        url: '/getKw',
        data: kw
      })
      .then(function (response) {
        this.notes = response.data;
      })
      .catch(function (error) {
        // alert(error.data);
      })
    },
    updateNote (note) {
      if (note.noteId == '') {
        var noteId = (+new Date).toString(36).slice(-8);
        note.noteId = noteId;
      }
      note.updateData = Date.now();
      return note;
    },
    saveNoteBk (note) {
      axios({
        method: 'post',
        url: 'getNote',
        data: note
      })
      .then(function (response) {

      })
      .catch(function (error) {
        // alert(error.data);
      })
    },
    saveNoteJs (note, index) {
      if (index == -1) {
        this.notes.push(note);
      } else {
        this.notes[index] = note;
      }
    },
    saveNote (note, index) {
      note = this.updateNote(note);
      this.saveNoteJs (note, index);
      this.saveNoteBk (note);
    },

    removeNoteJs (index) {
      this.notes.splice(index, 1);
    },
    removeNoteBk (noteId) {
      axios({
        method: 'post',
        url: '/getNote',
        params: 3
      })
      .then(function (response) {})
      .catch(function (error) {})
    },
    removeNote(note, index) {
      var storage=window.localStorage;
      storage.removeItem(this.notes[index]['title']);

      this.removeNoteJs(index);
      this.removeNoteBk(note.noteId);

    },
  },
});

app.use(Quasar, { config: {} });
app.mount("#q-app");
