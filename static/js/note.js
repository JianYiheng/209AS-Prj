var app = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  data: {
    isActive: false,
    title: 'Notepad',
    main_btn_text : "Save Note",
    subtitle: 'Using Vue JS',
    note: {
        title: '',
        text: ''
    },
    isEditing:false,
    editingIdx:0,

    notes: [
      {
        title: 'Example_1',
        text: 'This is a Note! :)',
        date: new Date(Date.now()).toLocaleString()
      },
      {
        title: 'Example_1',
        text: 'Another Note!',
        date: new Date(Date.now()).toLocaleString()
      }
    ]
  },
  methods: {
    addNote() {
      let {
          text,
          title
      } = this.note

      axios.post('http://localhost:3000/text', {
          title: title,
          text: text,
          contentType: 'application/x-www-form-urlencoded',
          date: new Date(Date.now()).toLocaleString(),
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      // axios.get('http://localhost:3000/')
      //   .then(function (response) {
      //     console.log(response);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      console.log(this.note, this.isEditing, this.note.text.length > 0 && this.note.title.length > 0);
      
      if (this.isEditing)
      {
          this.main_btn_text = "Save Note";
          this.isEditing = false;
          this.notes[this.editingIdx] = {
              text,
              title,
              date: new Date(Date.now()).toLocaleString()
          };
          this.isActive = false;
          this.note.text = "";
          this.note.title = "";
      }


      if (this.note.text.length > 0 && this.note.title.length > 0) {
          {
              this.notes.push({
              text,
              title,
              date: new Date(Date.now()).toLocaleString()
          })
          }
          
      this.isActive = false;
      this.note.text = "";
      this.note.title = "";
      } 
      else {
          this.isActive = true;
      }
    },

    removeNote(index) {
      this.notes.splice(index, 1)
    },

    editNote(index) {
      var data_item = this.notes[index];
      this.note["title"] = data_item["title"];
      this.note["text"] = data_item["text"]; 
      this.isEditing = true;
      this.editingIdx = index;

      // this.removeNote(index);
      this.main_btn_text = "Save Edition";
    }
    }
  }
)