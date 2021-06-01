Vue.component('results',
    {
        props: ['name', 'dir', 'snippet'],
        template: '<div class="card">\n' +
            '  <div class="container">\n' +
            '    <h4><b>{{name}}</b></h4>\n' +
            '    <p>{{snippet}}</p>\n' +
            '    <p>{{dir}}</p>\n' +
            '  </div>\n' +
            '</div>'
    })

var dataSourceBox = new Vue({
    el: '#dataSourceBox',
    data: {
        items: [
            { text: 'Research', image: 'testImages/folder.png'},
            { text: 'University', image: 'Not Available'}
        ]
    }
});
