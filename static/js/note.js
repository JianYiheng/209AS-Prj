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
    this.getKwAll();
    this.getAllNotes();
  },
  methods: {
    display(value) {
      console.log(value);
    },
    getIdbyIndex (index) {
      if (index==-1) {
        return this.newnote.noteId;
      } else {
        return this.notes[index].noteId;
      }
    },
    initNote () {
      for (const note of this.notes) {
        if (sessionStorage.getItem(note.noteId)) {
          const savenote = JSON.parse(sessionStorage.getItem(note.noteId));
          note.title = savenote.title;
          note.body = savenote.body;
          note.updateDate = savenote.udpateDate;
        }
      }
    },
    existTemp (index) {
      var noteId;
      if (index==-1) {
        noteId = this.newnote.noteId;
      } else {
        noteId = this.notes[index].noteId;
      }
      console.log(noteId);
      if (sessionStorage.getItem(noteId)) {
        console.log('yes');
        return true;
      } else {
        console.log('no');
        return false;
      }
    },
    saveTempTitle (value, initialValue, index) {
      const date = new Date();
      var body, noteId;
      if (index==-1) {
        this.newnote.editStatus = true;
        body = this.newnote.body;
        noteId = this.newnote.noteId;
      } else {
        this.notes[index].editStatus = true;
        body = this.notes[index].body;
        noteId = this.notes[index].noteId;
      }
      sessionStorage.setItem(noteId, JSON.stringify({
        title: value,
        body: body,
        updateDate: date.getTime()
      }));
    },
    saveTempBody (value, initialValue, index) {
      const date = new Date();
      var title, noteId;
      if (index==-1) {
        this.newnote.editStatus = true;
        title = this.newnote.title;
        noteId = this.newnote.noteId;
      } else {
        this.notes[index].editStatus = true;
        title = this.notes[index].title;
        noteId = this.notes[index].noteId;
      }
      sessionStorage.setItem(noteId, JSON.stringify({
        title: title,
        body: value,
        updateDate: date.getTime()
      }));
    },
    loadTemp (index) {
      var noteId;
      if (index==-1) {
        noteId = this.newnote.noteId;
      } else {
        noteId = this.notes[index].noteId;
      }

      return JSON.parse(sessionStorage.getItem(noteId));
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

    async getKwAll () {
      this.keywords = await axios({
        method: 'get',
        url: '/getKw'
      })
      .then(function (response) {
        return response.data.data;
      })
      .catch(function (error) {})
    },
    async getAllNotes () {
      this.notes = await axios({
        method: 'get',
        url: '/getNote',
        params: {'type': 0}
      })
      .then(function (response) {
        return response.data.data;
      })
      .catch(function (error) {})
    },

    getNote (noteId) {
      axios({
        method: 'get',
        url: '/getNote',
        
        params: {'type': 1, 'noteId': noteId}
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {})
    },


    async selectByKw (kw) {
      this.notes = await axios({
        method: 'post',
        url: '/getKw',
        data: kw
      })
      .then(function (response) {
        return response.data.data;
      })
      .catch(function (error) {})
    },

    resetNewNote () {
      this.newnote.title = "New Note Title";
      this.newnote.body = "New Note Text";
    },
    //updateNote (note) {
    updateNote (cur_note) {
      var note = {};
      note = Object.assign({}, cur_note);
      
      //console.log(note); /////////////////////////////////

      if (note.noteId == '') {
        var noteId = (+new Date).toString(36).slice(-8);
        note.noteId = noteId;
      }
      note.updateDate = Date.now();
      return note;
    },
    async saveNoteBk (note) {
      var new_note = {};
      new_note =  Object.assign({}, note);

      new_note = await axios({
        method: 'post',
        url: '/getNote',
        data: note,
        params: {'type': 2}
      })
      .then(function (response) {
        return response.data.data
      })
      .catch(function (error) {})

      return new_note;
    },
    saveNoteJs (note, index) {
      var new_obj;
      new_obj = Object.assign({}, note);
      if (index == -1) {
        this.notes.push(new_obj);
      } else {
        this.notes[index] = new_obj;
      }
    },
    async saveNote (cur_note, index) {
      var note = {};
      note = this.updateNote(cur_note);

      var note_bk =  await this.saveNoteBk (note);
      
      this.saveNoteJs (note_bk, index);

      this.resetNewNote ();

      this.getKwAll();
      console.log("keywords");
      console.log(this.keywords);
    },

    /* ************************************ */
    /* DELETE function                      */
    async deleteNoteBk (noteId) {
      var res = await axios({
        method: 'post',
        url: '/getNote',
        params: {
          'type': 3,
          'noteId': noteId
        }
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {});

      return res;
    },
    deleteNoteJs (index) {
      this.notes.splice(index, 1);
    },
    deleteNote (note, index) {
      var res = this.deleteNoteBk (note.noteId);
      this.deleteNoteJs (index);
      this.getKwAll();
    },
  },
});

app.use(Quasar, { config: {} });
app.mount("#q-app");
