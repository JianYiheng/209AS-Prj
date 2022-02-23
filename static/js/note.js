const app = Vue.createApp({
  compilerOptions: {
    delimiters: ["[[", "]]"]
  },
  data() {
    return {
      tag: {
        name: '',
        num: ''
      },
      tags: [{
        name: 'abc',
        num: 6
      }, {
        name: 'def',
        num: 12
      }],
      note: {
        noteId: '',
        title: '',
        body: '',
        keywords: '',
        updateDate: '',
        editStatus: false,
      },
      notes: [
        {
          noteId: '01010011',
          title: 'demo title',
          body: 'demo body',
          keywords: ['a', 'b', 'c', 'd'],
          updateDate: 'demo date',
          editStatus: false,
        },
        {
          noteId: '01010011',
          title: 'demo title',
          body: 'demo body',
          keywords: 'abcd',
          updateDate: 'demo date',
          editStatus: false,
        },
        {
          noteId: '01010011',
          title: 'demo title',
          body: 'demo body',
          keywords: 'abcd',
          updateDate: 'demo date',
          editStatus: false,
        }
      ]
    };
  },
<<<<<<< HEAD
  mounted:function()
  {
    this.recoverCache();
  },

=======
  mounted: function () {
    this.initNote();
  },
>>>>>>> web
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

<<<<<<< HEAD
      axios.post('/update', {
        title: title,
        body: body,
        index: 0 
      })
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function (error) {
        alert(error.data);
      })
      var storage=window.localStorage;
      storage[title] = body;

    },
    updateNote(index) {
      let {
        title,
        body
      } = this.notes[index]

      // axios.post('/update', {
      //   title: title,
      //   body: body,
      //   index: index
      // })
      axios({
        method:'post',
        url: '/update',
        data:{
          title: title,
          body: body,
          index: index,
        },
        contentType:'application/x-www-form-urlencoded'
      })
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function (error) {
        alert(error.data);
      });

      var storage=window.localStorage;
      storage[title] = body;
=======
>>>>>>> web
    },
    removeNote(index) {
      var storage=window.localStorage;
      storage.removeItem(this.notes[index]['title']);
      this.notes.splice(index, 1);

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
  },
});

app.use(Quasar, { config: {} });
app.mount("#q-app");


