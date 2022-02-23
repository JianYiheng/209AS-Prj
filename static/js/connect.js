function getNoteAll() {
    axios({
        method: 'get',
        url: '/getNote',
        params: 0
    })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        alert(error.data);
    });
}

function getNote(noteId) {
    axios({
        method: 'get',
        url: '/getNote',
        params: 1,
        data: noteId
    })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        alert(error.data);
    });
}

function uploadNote(noteId) {
    axios({
        method: 'post',
        url: '/getNote',
        params: 2,
        data: noteId
    })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        alert(error.data);
    })
}

function getKwAll () {
    axios({
        method: 'get',
        url: '/getKw'
    })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        alert(error.data);
    });
}

function getKw (kw) {
    axios({
        method: 'post',
        url: '/getKw',
        data: kw
    })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        alert(error.data);
    })
}

export { getNote, getNoteAll, uploadNote, getKw, getKwAll }