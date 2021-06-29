// Latest image to be requested.
var request;
// Image currently being shown
var $current;
// Cache object.
var cache = {};
// Container for image
var $frame = $("#photo-viewer");
// Container for image
var $thumbs = $(".thumb");

// Function to fade between images.Pass in new image as parameter

function crossfade($img)
{
  // If there is currently an image showing.
  if ($current)
  {
    // stop animaiton and fade it out
    $current.stop().fadeOut("slow");
  }

  // Set the css margins for the image
  $img.css(
    {
      // Negative margin of half image's width
      marginLeft: -$img.width() / 2,
      // Negative marging of half image's height
      marginTop: -$img.height() / 2,
    });

    // Stop animation on new image and fade in
    $img.stop().fadeTo("slow", 1);

    // New image becomes current image
    $current = $img;
}

// When a thumb is clicked on
$(document).on("click", ".thumb", function(e)
{
  // Create local variable called $img
  var $img;
  // Store path to image
  var src = this.href;
  // Store path again in request.
  request = src;
  // Stop default link behavior.
  e.preventDefault();

  // remove active from all thumbs
  $thumbs.removeClass("active");
  $(this).addClass("active");

  // If cache contains this image
  if (cache.hasOwnProperty(src))
  {
    // And if isLoading is false
    if (cache[src].isLoading === false)
    {
      // Call crossfade
      crossfade(cache[src].$img);
    }
  }
  // otherwise it is not cache
  else
  {
    // Store empty <img/> element in $img
    $img = $("<img/>");
    // Store this image in Cache
    cache[src] =
    {
      // Add the path to the image
      $img: $img,
      // Set isLoading property to true
      isLoading: true
    };

    // Next few lines will run when image has loaded but are prepeared standfirst
    // When image has loaded
    $img.on("load", function()
    {
      // hide it
      $img.hide();
      // Remove is-loading class from frame and append new image to it.
       $frame.removeClass("is-loading").append($img);
       // Update isLoading in cache
       cache[src].isLoading = false;
       // If still most recently requested image then
       if (request === src)
       {
         // Call crossfade(). Solves asynchronous loading issue.
         crossfade($img);
       }
    });

    // Add is-loading class to frame
    $frame.addClass("is-loading");

    // Set attributes on <img> element
    $img.attr(
      {
        // Add src attribute to load image
        "src": src,
        // Add title if one was given in link
        "alt": this.title || ""
      });
  }
});

// Runs once (When rest of the script has loaded) to show the first image
// Simulate click on first thumbnail
$(".thumb").eq(0).click();
