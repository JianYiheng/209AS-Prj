from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
import os
import json


class HTMLHandler(RequestHandler):
    def get(self):
        self.render("index.html")

class UpdateHandler(RequestHandler):
    def post(self):
        data = json.loads(self.request.body.decode("utf-8"))
        print(data)
        print(data.get("title"))


        self.write('OK')
        # print({k:''.join(v) for k,v in .items()})
        return
    get = post

    def options(self, *args, **kwargs):
        pass

def make_app():
    handlers = [(r"/", HTMLHandler), (r"/update", UpdateHandler)]
    settings = {
        "template_path": os.path.join(os.path.dirname(__file__), "templates"),
        "static_path": os.path.join(os.path.dirname(__file__), "static")
    }
    return Application(handlers, **settings, debug=True)


if __name__ == '__main__':
    app = make_app()
    app.listen(3000, '0.0.0.0')
    IOLoop.instance().start()