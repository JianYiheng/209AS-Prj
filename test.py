from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
import os


class HTMLHandler(RequestHandler):
    def get(self):
        self.render("index.html")

class UpdateHandler(RequestHandler):
    def post(self):
        print({k:''.join(v) for k,v in  self.request.arguments.items()})
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