// jQuery for mobil responsivness and even=t
$(document).ready(function(){

  // Nav Bar Mobile Slider
  $(".button-collapse").sideNav();

  // Click Listener for form submission to ADD a comment
  $('.addComment').on('click', function() {
    // Get _id of comment to be deleted
    var articleId = $(this).data("id");
    // URL root 
    var baseURL = window.location.origin;
    // Get Form Data by Id
    var formName = "form-add-" + articleId;
    var form = $('#' + formName);

    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/add/comment/' + articleId,
      type: 'POST',
      data: form.serialize(),
    })
    .done(function() {
      // Refresh the Window after the call is done
      location.reload();
    });
    
    // Prevent Default
    return false;

  });


  // Click Listener for FORM SUBMISSION to DELETE a comment
  $('.deleteComment').on('click', function(){

    // Get id of comment to be deleted
    var commentId = $(this).data("id");

    // URL root (so it works in either LocalHost or Heroku)
    var baseURL = window.location.origin;

    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/remove/comment/' + commentId,
      type: 'POST',
    })
    .done(function() {
      // Refresh Window after the call is done
      location.reload();
    });
    
    // Prevent Default
    return false;
  });
  
});