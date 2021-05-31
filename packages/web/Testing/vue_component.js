
//We need to make use of components instead of instances (below is an instance :( )
var box = new Vue({
    el: '#box',
    data: {
        items: [
            { text: 'Research', image: 'THIS IS AN IMAGE'},
            { text: 'University', image: 'THIS IS AN IMAGE' },
            { text: 'Recipes' , image: 'THIS IS AN IMAGE'}
        ]
    }
});

box.item.push({ text: 'New item' })