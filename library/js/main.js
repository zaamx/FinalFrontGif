Stamplay.init('photobooth');
// var posts = new Stamplay.Cobject('entries').Collection;
var posts = new Stamplay.Cobject('entries').Collection;
var user = new Stamplay.User().Model;


$(document).ready(function () {

  /****************************/
  /*      RENDER CONTENT      */
  /****************************/

  var page_param = (Utils.getParameterByName('page') === "") ?  1 : Utils.getParameterByName('page');

  var queryParam = {
    sort: '-actions.ratings.total',
    per_page: 30,
    page: 1,
  };


  if (window.location.href.indexOf("item") > -1) {
    getPostDetail();
  } else if (window.location.href.indexOf("newest") > -1) {
    queryParam.sort = '-dt_create';
  } else if (window.location.href.indexOf("search") > -1) {
    var _id = Utils.getParameterByName("id");
    queryParam._id = _id;
  }

  getSortedPostList(posts, queryParam);
  $('#newest').css('font-weight', 'none');

  $("#morenews").on("click", function(event) {
      event.preventDefault();
      queryParam.page += 1;
      getSortedPostList(posts, queryParam);
  })



  /****************************/
  /* UPVOTE AND COMMENT POSTS */
  /****************************/
  $('body').on('click', 'a.voteelem', function (e) {
    e.preventDefault();
    var postid = $(this).data('postid');

    var post = new Stamplay.Cobject('entries').Model;
    post.set('_id', postid);
    post.upVote().then(function () {
      var score = $("#score_" + postid).data('score');
      score++;
      $("#score_" + postid).html(score + ' points');
    });
  });


  /****************************/
  /*       CONTACT FORM       */
  /****************************/
  $("#contactform").submit(function (event) {
    event.preventDefault();
    var email = $("#contactform input[name='email']").val();
    var message = $("#contactform textarea[name='message']").val();

    var newContactMessage = new Stamplay.Cobject('contact').Model;
    newContactMessage.set('email', email);
    newContactMessage.set('message', message);
    newContactMessage.save().then(function () {
      window.location.href = "/index.html";
    });

  });

  function heroInit() {    
    var hero = jQuery('#hero-home');

    winHeight = jQuery(window).height();
    hero.css({height: winHeight+"px"});

  };
  jQuery(window).on("resize", heroInit);
  jQuery(document).on("ready", heroInit);

}); // Cierre de document ready



/****************************/
/*   GET SINGLE POST INFO   */
/****************************/
function getPostDetail() {
  var postId = Utils.getParameterByName("id");
  var post = new Stamplay.Cobject('entries').Model;
  post.fetch(postId).then(function () {

    var viewData = {
      id : post.get('_id'),
      url : post.get('url'),
      img : post.get('images'),
      shortUrl : Utils.getHostname(post.get('url')),
      title : post.get('title'),
      dt_create : Utils.formatDate(post.get('dt_create')),
      votesLength : post.get('actions').votes.users_upvote.length
    }
    Utils.renderTemplate('post-detail', viewData, '#postcontent');

    post.get('actions').comments.forEach(function (comment) {
      var viewData = {
        displayName: comment.displayName,
        dt_create: Utils.formatDate(comment.dt_create),
        text: comment.text
      }
      Utils.renderTemplate('post-comment', viewData, '#postcomments');
    })

  }).catch(function (err) {
    console.log('error', err);
  })
}


/****************************/
/*     RENDER POST LIST     */
/****************************/
function getSortedPostList(posts, queryParam) {

  posts.fetch(queryParam).then(function () {
    var viewDataArray = [];

    $('#newstable').html('');
    posts.instance.forEach(function (post, count) {

      var tituloJson = post.get('title');
      

      if (!tituloJson) {
        var tituloJson = "Sin titulo"
      };

      console.log(tituloJson);

      var viewData = {
        id: post.get('_id'),
        count : count+1,
        url: post.get('url'),
        shortUrl: Utils.getHostname(post.get('url')),
        // title: post.get('title'),
        title: tituloJson,
        dt_create: Utils.formatDate(post.get('dt_create')),
        commentLength: post.get('actions').comments.length,
        votesLength: post.get('actions').votes.users_upvote.length
      }
      viewDataArray.push(viewData)

    });
    Utils.renderTemplate('list-elem', viewDataArray, '#newstable');

  })
}
