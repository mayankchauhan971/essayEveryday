$(window).scroll(function(){
    if ($(this).scrollTop() > 50) {
       $('#dynamic').addClass('opaque-navbar');
    } else {
       $('#dynamic').removeClass('opaque-navbar');
    }
});

var newEssayForm = document.getElementById('newEssayForm');
var submitButton = document.getElementById('submitButton');

/**
 * Handle when user submit the article
 */
submitButton.addEventListener('click', function (event) {
  event.preventDefault();
  window.onbeforeunload = null;
  
  // create essay payload
  const payload = {
    title: newEssayForm.title.value,
    content: quill.getContents()
  }
  
  // Post it to server
  fetch('/write', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log('Essay successfully created')
      
      // redirect user to edit page
      window.location.href = '/my-essay/' + data.newArticle._id + '/edit';
    })
    .catch(function(err){
      res.send(err.message)
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