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
        body: 'New Note'
      },
      notes: []
    };
  },
  methods: {
    newNote() {
      let {
        title,
        body
      } = this.newnote
      
      this.notes.push({
        title,
        body
      });
      
      this.newnote.title = "New Title";
      this.newnote.body = "New Note";

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
    },
    removeNote(index) {
      this.notes.splice(index, 1);
    },
  },
});

app.use(Quasar, { config: {} });
app.mount("#q-app");
