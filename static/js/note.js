const app = Vue.createApp({
  compilerOptions: {
    delimiters: ["[[", "]]"]
  },
  data() {
    return {
      keywords: [],
      keywordsAll: [],
      newnote: {
        noteId: '',
        title: 'New Note Title',
        body: 'New Note Text',
        keywords: '',
        subekeywords: '',
        updateDate: '',
        rewrite:'',
        editStatus: false,
      },
      notes: [],

      searchInput: ''
    };
  },
  async mounted() {
    this.getKwAllFull();
    this.notes = await this.getAllNotes();
  },
  methods: {
    display(value) {
      console.log(value);
    },
    keyword2candidate(note, kw) {
      if (note.isExpanded) {
        note.keywords = note.keywords.filter(item=>item!==kw);
        note.candidate_keywords.unshift(kw);
      }

    },
    candidate2keyword(note, cd) {
      note.candidate_keywords = note.candidate_keywords.filter(item=>item!==cd);
      note.keywords.push(cd);
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

    /* ****************************************** */
    // Request all keywords from backend
    getKwAll () {
      return axios({
        method: 'get',
        url: '/getKw'
      })
      .then(function (response) {
        return response.data.data;
      })
      .catch(function (error) {})
    },

    // add color pripority to keywords
    async getKwAllFull () {
        let kw_array = await this.getKwAll();
        this.keywords = []
        for (var i=0; i<kw_array.length; i++) {
          this.keywords.push({
            name: kw_array[i],
            color: 'primary'
          });
        }

        this.keywordsAll = this.keywords;

    },
    /* ****************************************** */
    getAllNotes () {
      return axios({
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
      return axios({
        method: 'get',
        url: '/getNote',

        params: {'type': 1, 'noteId': noteId}
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {})
    },

    /* ********************************************** */
    // Highlight the selected keywords
    selectByKwHg (kw, idx) {
      if (kw.color=='primary') {
        kw.color = 'amber';
        this.keywords = this.keywords.filter(item=>item!==kw);
        this.keywords.unshift(kw);
      } else {
        kw.color = 'primary';
        this.keywords = this.keywords.filter(item=>item!==kw);
        this.keywords.push(kw);
      }
    },

    selectByKwArray () {
        let kwArray = this.keywords.filter(item=>item.color=='amber');
        return kwArray.map(item=>item.name);
    },

    // Send selected keywords to backend
    selectByKwBk (kw_array) {
      return axios({
        method: 'post',
        url: '/getKw',
        data: {
          'data': kw_array
        }
      })
      .then(function (response) {
        return response.data.data;
      })
      .catch(function (error) {})
    },

    async selectByKw(kw, idx) {
        this.selectByKwHg(kw, idx);
        let kw_array = this.selectByKwArray ();
        this.notes = await this.selectByKwBk(kw_array);
    },
    /* ********************************************** */

    /* ********************************************** */
    /* Reset New Note  */
    resetNewNote () {
      this.newnote.title = "New Note Title";
      this.newnote.body = "New Note Text";
    },
    /* ********************************************** */

    /* ********************************************** */
    //updateNote (note) {
    updateNote (cur_note) {
      var note = {};
      note = Object.assign({}, cur_note);

      if (note.noteId == '') {
        var noteId = (+new Date).toString(36).slice(-8);
        note.noteId = noteId;
      }
      note.updateDate = Date.now();
      return note;
    },
    /* ************************************ */

    /* ************************************ */
    // Save note function
    saveNoteBk (note) {
      var new_note = {};
      new_note =  Object.assign({}, note);

      return axios({
        method: 'post',
        url: '/getNote',
        data: note,
        params: {'type': 2}
      })
      .then(function (response) {
        return response.data.data
      })
      .catch(function (error) {})
    },
    saveNoteJs (note, index) {
      var new_obj;
      new_obj = Object.assign({}, note);
      console.log(new_obj)
      if (index == -1) {
        this.notes.push(new_obj);
      } else {
        this.notes[index] = new_obj;
      }
    },
    async saveNote (cur_note, index) {
      var note = {};
      note = this.updateNote(cur_note);

      var note_bk = await this.saveNoteBk (note);

      this.saveNoteJs (note_bk, index);

      this.resetNewNote ();

      this.getKwAllFull();
    },
    /* ************************************ */

    /* ************************************ */
    /* DELETE function                      */
    deleteNoteBk (noteId) {
      return axios({
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
    async deleteNote (note, index) {
      var res = this.deleteNoteBk (note.noteId);
      this.deleteNoteJs (index);
      this.keywords = this.getKwAllFull();
    },
    /* ************************************ */

    /* ************************************ */
    // Search function

    searchKw() {
      var kw_array = [];
      console.log(this.keywordsAll);
      for (const num in this.keywordsAll) {
        let kw = this.keywordsAll[num];
        if (kw.name.toLowerCase().includes(this.searchInput.toLowerCase())) {
          kw_array.push(kw);
        }
      }
      this.keywords = kw_array;
    },

    searchClear () {
      this.keywords = this.keywordsAll;
    },

    searchNoteBk () {
      return axios ({
        method: 'post',
        url: '/search',
        data: {
          'data': this.searchInput
        }
      })
      .then (function (response) {
        return response.data.data;
      })
      .catch (function (error) {})
    },

    searchNoteJs (notes) {
      this.notes = notes;
    },

    async searchNote () {
      let notes = await this.searchNoteBk ();
      this.searchNoteJs (notes);
    },

    /* ************************************ */
  },
  watch: {
    searchInput (newsearchInput, oldsearchInput) {
      if (this.searchInput) {
        this.searchKw();
      } else {
        this.searchClear();
      }
    }
  }
});

app.use(Quasar, { config: {} });
app.mount("#q-app");
