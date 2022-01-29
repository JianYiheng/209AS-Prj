from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
import os


class HTMLHandler(RequestHandler):
    def get(self):
        self.render("index.html")

class Handler_2(RequestHandler):
    def post(self):
        a = self.get_argument('title')
        b = self.get_argument('text')
        c = self.get_argument('date')
        print(a,b,c)
        return
    get = post

    def options(self, *args, **kwargs):
        pass

def make_app():
    handlers = [(r"/", HTMLHandler), (r"/text", Handler_2)]
    settings = {
      "template_path": os.path.join(os.path.dirname(__file__), "templates"),
      "static_path": os.path.join(os.path.dirname(__file__), "static")
    }
    return Application(handlers, **settings, debug=True)


if __name__ == '__main__':
    app = make_app()
    app.listen(3000)
    IOLoop.instance().start()