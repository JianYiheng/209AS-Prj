from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
import os
import json
from keyword_extraction import id_note, keyword_note, Note
from keyword_extraction import extract_from_para, save_note_and_keywords, search, save_or_update_keywords

saved_notes = []

class HTMLHandler(RequestHandler):
    def get(self):
        self.render("index.html")

class UploadNoteHandler(RequestHandler):
    def post(self):
        dtype = self.get_argument('type')

        if int(dtype) == 2:
            data = json.loads(self.request.body.decode("utf-8"))
            # data = json.loads(self.get_argument('data').decode("utf-8"))
            print(data)

            note_title = data.get("title")
            note_body = data.get("body")
            note_id = data.get("noteId")
            note_updatetime = data.get("updateDate")

            note_obj = Note(note_id, note_title, note_body, None, note_updatetime)
            save_note_and_keywords(note_obj)

            ret_dict = {'data': id_note[note_id].gen_dict()}
            ret_json = json.dumps(ret_dict)
            self.write(ret_json)

        elif int(dtype) == 3:
            note_id = self.get_argument('noteId')
            del id_note[note_id]
            to_remove = None
            print("****************************************")
            print(keyword_note)
            print("****************************************")
            for key in keyword_note:
                print("========================================")
                print(keyword_note[key])
                print("========================================")
                if keyword_note[key]["noteId"] == note_id:
                    to_remove = key
                    break
            if to_remove is not None:
                del keyword_note[to_remove]

        print(keyword_note)
        print(id_note)
        return

    def get(self):
        dtype = self.get_argument('type')

        if int(dtype) == 0:
            ret_list = []
            for key in id_note:
                ret_list.append(id_note[key].gen_dict())
            ret_dict = {'data': ret_list}
            ret_json = json.dumps(ret_dict)
            self.write(ret_json)
            return
        elif int(dtype) == 1:
            note_id = self.get_argument('noteId')
            ret_dict = {'data': id_note[note_id].gen_dict()}
            ret_json = json.dumps(ret_dict)
            self.write(ret_json)
            return

    def options(self, *args, **kwargs):
        pass

class getKwHandler(RequestHandler):
    def get(self):
        ret_list = []
        for key in id_note:
            for keyword in id_note[key].gen_dict()['keywords']:
                ret_list.append(keyword)
        ret_list = list(set(ret_list))
        ret_dict = {'data': ret_list}
        ret_json = json.dumps(ret_dict)
        self.write(ret_json)
        return

    def post(self):
        data = json.loads(self.request.body.decode("utf-8"))
        print(data)

        kw = data.get("data")

        search_res = search(kw)

        print("****************************************")
        print(search_res)
        print("****************************************")
        ret_dict = {'data':search_res}
        ret_json = json.dumps(ret_dict)
        self.write(ret_json)
        return

def make_app():
    handlers = [(r"/", HTMLHandler),
                (r"/getNote", UploadNoteHandler),
                (r"/getKw", getKwHandler)
                ]
    settings = {
        "template_path": os.path.join(os.path.dirname(__file__), "templates"),
        "static_path": os.path.join(os.path.dirname(__file__), "static")
    }
    return Application(handlers, **settings, debug=True)


if __name__ == '__main__':
    app = make_app()
    app.listen(3000, '0.0.0.0')
    IOLoop.instance().start()