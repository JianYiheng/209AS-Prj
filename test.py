from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop


class HelloHandler(RequestHandler):
    def get(self):
        with open('./templates/index.html', 'rb') as f:
            self.write(f.read())
        return


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

class Handler_3(RequestHandler):
    def get(self):
        with open('./static/js/note.js', 'rb') as f:
            self.write(f.read())
        return
    # get = post
    def options(self, *args, **kwargs):
        pass

def make_app():
    urls = [(r"/", HelloHandler), (r"/text", Handler_2), (r"/note.js", Handler_3)]
    return Application(urls, debug=True)


if __name__ == '__main__':
    app = make_app()
    app.listen(3000)
    IOLoop.instance().start()