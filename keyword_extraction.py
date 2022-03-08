import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import treebank
from collections import defaultdict


import string
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.porter import PorterStemmer

import enchant
d = enchant.Dict('en_US')

def extract_from_para(note, top_k=5):
    stop_words = set(stopwords.words('english'))
    extract_for_all_paragraphs = defaultdict(int)

    sen_tokenize_res = sent_tokenize(note.body)
    filter_list = {'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
                   'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
                   'a', 'abbr', 'name'}
    net_label = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'em', 'menu', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rp', 'rt', 'rt', 'ruby', 'ruby', 's', 'samp', 'script', 'section', 'section', 'select', 'small', 'source', 'source', 'video', 'audio', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'template', 'title', 'tr', 'track', 'track', 'tt', 'u', 'ul', 'var', 'video', 'video', 'wbr',
                 'h1', 'h2','h3','h4','h5','h6']
    filter_list.update(set(net_label))


    for sentence in sen_tokenize_res:
        tokenizer = RegexpTokenizer(r'\w+')
        word_res = tokenizer.tokenize(sentence)

        filtered_sentence = []

        for word in word_res:
            if word not in stop_words or word.isalpha():
                filtered_sentence.append(word.strip())
        # print(sentence)

        tagged = nltk.pos_tag(word_res)
        entities = nltk.chunk.ne_chunk(tagged)
        # print(entities)

        extracted = []
        NER = []
        for i in range(len(entities)):
            if type(entities[i]) is not nltk.Tree:
                a, b = entities[i]
            else:
                a, b = entities[i][0]

            cmp_key = a.lower()
            if cmp_key in filter_list:
                continue

            if b == 'NN' and len(a) > 1:
                extracted.append(a)
            elif b == 'NNP' and len(a) > 1:
                NER.append(a)
            elif not d.check(a) and len(a) > 1:
                NER.append(a)

        final_res = NER + extracted
        # print('Extracted Keywords: ', ' '.join(final_res))
        # print()
        for word in final_res:
            extract_for_all_paragraphs[word] += 1


    extract_for_all_paragraphs = list(extract_for_all_paragraphs.items())
    extract_for_all_paragraphs = sorted(extract_for_all_paragraphs, key=lambda x: -x[1])
    # print('\n' * 5)

    ret_top = []
    for i in range(min(top_k, len(extract_for_all_paragraphs))):
        # print(extract_for_all_paragraphs[i][0])
        ret_top.append(extract_for_all_paragraphs[i][0])

    ret_candid = []
    for i in range(min(top_k, len(extract_for_all_paragraphs)) + 1, len(extract_for_all_paragraphs)):
        # print(extract_for_all_paragraphs[i][0])
        ret_candid.append(extract_for_all_paragraphs[i][0])

    return [ret_top, ret_candid]




    


class Note:
    
    def __init__(self, noteId, title, body, keywords, updateDate):
        self.noteId = noteId
        self.title = title
        self.body = body
        self.keywords = keywords
        self.updateDate = updateDate

    def gen_dict(self):
        ret = dict()
        ret["title"] = self.title
        ret["body"] = self.body
        ret["noteId"] = self.noteId
        ret["updateDate"] = self.updateDate
        ret["keywords"] = self.keywords
        return ret

id_note = {}
keyword_note = {}


def save_or_update_note(note):
    id_note[note.noteId] = note


def save_or_update_keywords(note, keywords):
    note.keywords = []
    for keyword in keywords:
        note.keywords.append(keyword)
        if keyword in keyword_note:
            id_notes = keyword_note.get(keyword)
            id_notes[note.noteId] = note
        else:
            id_notes = {}
            id_notes[note.noteId] = note
            keyword_note[keyword] = id_notes

def save_note_and_keywords(note):
    save_or_update_note(note)
    top_keywords, candidate_keywords = extract_from_para(note)
    save_or_update_keywords(note, top_keywords)
           
def search(keyword_arr):
    notes = []
    notes = id_note.values()
    res = []
    for note in notes:
        flag = 1
        for keyword in keyword_arr:
            flag = note.body.find(keyword)
            if flag == -1:
                break
        if (flag != -1):
            res.append(note.gen_dict())
    return res




if __name__ == '__main__':
    # example_note = 'Want to leave an important message to someone? Or record an essential detail that you don’t want to forget? Then you need not worry about whether to write a short informal letter or written message to a particular person or to an organization. You can even customize or decorate it for a more personalized touch.'

    # example_note = "Jim is the one who plays footable for the USA. He even played in the FIFA."

    example_note = '''
Open-access papers have drastically fewer lead authors from low-income regions than do paywalled articles, an analysis of tens of thousands of articles shows. The findings suggest that the fees that journals charge to publish articles open access pose a barrier for authors in low- and middle-income countries — something that scientists had previously suspected but found difficult to demonstrate.

Increasing numbers of scholarly journals — including Nature — have been making their articles open access, driven in part by requirements from funders (Nature’s news team is editorially independent of its publisher Springer Nature). Although this shift has been making the scholarly literature more widely accessible, many researchers have noted that the article-processing charges (APCs) typically required to publish research open access can deter authors from using this option.

“One of the great ironies of open access is that you grant authors around the world the ability to finally read the scientific literature that was completely closed off to them, but it ends up excluding them from publishing in the same journals,” says Emilio Bruna, an ecologist and scholar of Latin American studies at the University of Florida in Gainesville.

Although many in the scientific community recognize this, it’s been a challenge to demonstrate it empirically, says Bruna. One problem is the difficulty of directly comparing open-access and non-open-access journals, because even those from the same publisher might differ in factors such as reputation and standards of acceptance.

The Dutch publisher Elsevier’s ‘mirror journals’ pilot project, which ran from 2018 to 2020, offered Bruna’s team an opportunity. Under this programme, existing hybrid journals, which contain both paywalled and freely accessible articles, shared titles and editorial and peer-review processes with fully open-access versions, termed mirror journals. “It’s as close as you can get to a natural experiment,” Bruna says.

His group examined more than 37,000 articles published in 38 pairs of mirror and ‘parent’ journals, which mostly published paywalled content. The researchers identified the geographical location of each paper’s first author, then looked up the country’s World Bank income category and whether the author qualified for a full or partial APC waiver under Elsevier’s Research4Life programme for authors from certain countries. The APCs for the mirror journals cost a median of US$2,600; most of the hybrid journals had APCs identical to those of their mirror journals.
Global divide

Overall, mirror journals had more articles with lead authors from North America, East Asia and the Pacific region than did paywalled articles in their corresponding parent versions. They had fewer lead authors from lower-income areas, in particular those in the global south, such as Latin America and the Caribbean, the Middle East and North Africa, and sub-Saharan Africa. Around 80% of articles in mirror journals had first authors from high-income countries, and none had first authors from low-income countries.

“When we see results like this, it just makes it crystal clear that there is a very strong financial barrier for publishing when journals charge APCs,” says Rafael Zenni, an ecologist at the Federal University of Lavras in Brazil. “It’s something that we face every day. In our research grants, there are rarely any resources for publishing fees.”

The team also found that authors based in countries eligible for the waiver programme almost never published open-access articles. Bruna was surprised by how ineffective waivers seemed to be. And when waivers are used, even large discounts don’t reduce the cost enough for authors from lower-income regions, who often pay APCs out of their own pockets.

“It’s widely known that APCs deter authors without means, but this particular method of quantifying the economic barrier to these authors is new and I think it should be persuasive,” says Peter Suber, director of the Harvard Office for Scholarly Communication in Cambridge, Massachusetts. “APCs distort research they exclude authors, and we should all be trying to find ways to overcome those barriers,” says Suber.

Elsevier declined the Nature news team’s request for comment on this study.
'''



    #print(extract_from_para(example_note, 15))
    note = Note("sdad", "sdad", example_note, None, 2000)
    save_note_and_keywords(note)
    note2 = Note("sdad", "sad", "The", None, 23)
    save_or_update_note(note2)
   # print(keyword_note.get("income").get(10).body)

    search_res = search("The")
    print(search_res[0].body)

    pass
    



