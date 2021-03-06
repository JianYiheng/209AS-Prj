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
            note_rewrite = data.get("rewrite")

            note_keywords = data.get("keywords")
            note_candidate_keywords = data.get("candidate_keywords")
            note_isExpanded = data.get("isExpanded")


            if note_rewrite == '':
                note_obj = Note(note_id, note_title, note_body, None, None, note_updatetime, True, note_isExpanded)
            else:
                note_obj = Note(note_id, note_title, note_body, note_keywords,
                                note_candidate_keywords, note_updatetime, note_rewrite, note_isExpanded)

            save_note_and_keywords(note_obj)
            note_obj.rewrite = False

            ret_dict = {'data': id_note[note_id].gen_dict()}
            ret_json = json.dumps(ret_dict)
            self.write(ret_json)

        elif int(dtype) == 3:
            note_id = self.get_argument('noteId')
            del id_note[note_id]
            to_remove_key = []
            for key in keyword_note:
                dict_item = keyword_note[key]
                to_remove = []
                for var in dict_item:
                    if var not in id_note:
                        to_remove.append(var)
                        # del dict_item[var]
                for var in to_remove:
                    del dict_item[var]

                if len(dict_item) == 0:
                    to_remove_key.append(key)
            for key in to_remove_key:
                del keyword_note[key]
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

        kw_arr = data.get("data")


        search_res = search(kw_arr)

        print("****************************************")
        print(search_res)
        print("****************************************")
        ret_dict = {'data':search_res}
        ret_json = json.dumps(ret_dict)
        self.write(ret_json)
        return

class searchHandler(RequestHandler):
    def get(self):
        return

    def post(self):
        data = json.loads(self.request.body.decode("utf-8"))
        print(data)
        query = data.get("data")

        search_res = search(query, match_all=True)

        ret_dict = {'data':search_res}
        ret_json = json.dumps(ret_dict)
        self.write(ret_json)
        print(ret_json)
        return


def make_app():
    handlers = [(r"/", HTMLHandler),
                (r"/getNote", UploadNoteHandler),
                (r"/getKw", getKwHandler),
                (r"/search", searchHandler)
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