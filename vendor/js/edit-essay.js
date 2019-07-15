$(window).scroll(function(){
    if ($(this).scrollTop() > 50) {
       $('#dynamic').addClass('opaque-navbar');
    } else {
       $('#dynamic').removeClass('opaque-navbar');
    }
});

var editEssayForm = document.getElementById('editEssayForm');

/**
 * Handle when user submit the article
 */
editEssayForm.addEventListener('submit', function (event) {
  event.preventDefault();
  
  // create essay payload
  const payload = {
    title: editEssayForm.title.value,
    content: quill.getContents()
  }

  fetch('/write', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function () {
      console.log('success')
    })
})

var Delta = Quill.import('delta');
var quill = new Quill('#editor-container', {
  modules: {
    toolbar: true
  },
  placeholder: 'Your essay goes here...',
  theme: 'snow'
});

var existingContent = editEssayForm.content.value;
/* if content is exists, set editor content */
if (existingContent) {
  // convert JSON string to javascript object
  var content = JSON.parse(existingContent)
  quill.setContents(content)
}

// Store accumulated changes
var change = new Delta();
quill.on('text-change', function(delta) {
  change = change.compose(delta);
});

// Check for unsaved data
window.onbeforeunload = function() {
  if (change.length() > 0) {
    return 'There are unsaved changes. Are you sure you want to leave?';
  }
}