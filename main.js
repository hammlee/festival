/** @format */

// 작품 불러오기
$(document).ready(function () {
  var cardContainer = $(".card-container");
  cardContainer.html(
    '<div class="loading-text"><i class="fas fa-spinner fa-spin"></i> 작품을 불러오는 중...</div>'
  );

  $.getJSON(
    "https://script.google.com/macros/s/AKfycbyMEu2h2AN7ob9oISsmDJuUBbwsB2AnwKhQpR9lJ8vBtvS3NNIXEtRrY41QEHjc4SDL_w/exec?function=doGet",
    function (data) {
      cardContainer.empty();
      var totalCount = String(data.length + 1) + "건";
      $("#content-count").text(totalCount);

      // likeCount > 0과 likeCount = 0인 데이터를 분리
      var dataWithLikes = data.filter((item) => item.likeCount > 0);
      var dataWithoutLikes = data.filter((item) => item.likeCount == 0);

      // 각각의 배열을 필요한 방식으로 정렬
      dataWithLikes.sort(function (a, b) {
        return b.likeCount - a.likeCount;
      });

      dataWithoutLikes.sort(function (a, b) {
        return b.id - a.id;
      });

      // 두 배열을 다시 합치기
      data = dataWithLikes.concat(dataWithoutLikes);

      var rank = 1;
      var previousLikeCount = -1;
      var count = 0;

      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var cardText = item.text ? item.text.replace(/\r\n/g, "<br>") : "";
        var cardRank = "";

        if (item.likeCount > 0) {
          if (item.likeCount == previousLikeCount) {
            count++;
          } else {
            rank += count;
            count = 1;
          }
          cardRank = "현재 " + rank + "위";
          previousLikeCount = item.likeCount;
        }

        var card = `
          <div class="col-md-6 col-lg-6 mb-3">
            <div class="card card-black">
              <div class="card-badge">${item.id}</div>
              ${cardRank ? `<div class="card-rank">${cardRank}</div>` : ""}
              <div class="card-body">
                <p class="card-text">${cardText}</p>
              </div>
              <div class="card-footer">
                <button class="btn btn-light btn-sm recommend-button">
                  <span class="icon-wrapper">
                    <i class="fas fa-thumbs-up"></i>
                  </span>
                  <span class="like-count">${item.likeCount}</span>
                </button>
                <h5 class="card-name">from <span class="card-name-from">${
                  item.name
                }</span></h5>
              </div>
            </div>
          </div>
        `;

        cardContainer.append(card);
      }
    }
  );
});

// 작품 추천하기
$(document).on("click", ".recommend-button", function (event) {
  event.preventDefault(); // 기본 동작 중단

  var cardName = $(this).closest(".card-footer").find(".card-name-from").text();
  var id = $(this).closest(".card-black").find(".card-badge").text();

  $.ajax({
    url: "https://script.google.com/macros/s/AKfycbyMEu2h2AN7ob9oISsmDJuUBbwsB2AnwKhQpR9lJ8vBtvS3NNIXEtRrY41QEHjc4SDL_w/exec",
    method: "POST",
    data: {
      functionName: "increaseLikeCount",
      id: id
    },
    success: function (response) {
      alert(cardName + "님의 작품을 추천하셨습니다.");
      location.reload();
    },
    error: function (error) {
      alert("추천에 실패했습니다. 잠시 후에 다시 시도해주세요.");
    }
  });
});

// 작품 제출하기
$("form").submit(function (event) {
  event.preventDefault();
  console.log($("form").serialize());
  $.ajax({
    url: "https://script.google.com/macros/s/AKfycbyMEu2h2AN7ob9oISsmDJuUBbwsB2AnwKhQpR9lJ8vBtvS3NNIXEtRrY41QEHjc4SDL_w/exec?function=doPost",
    method: "POST",
    data: $("form").serialize(),
    // data: {
    //   functionName: "addArticle",
    //   ...$("form").serialize()
    // },
    success: function (response) {
      alert("제출이 완료되었습니다.");
      location.reload();
    },
    error: function (error) {
      alert("제출에 실패했습니다. 다시 시도해주세요.");
    }
  });
});

// 남은 시간 보여주기
function updateCountdown() {
  var targetDate = new Date("2023-05-28T23:59:59");
  var now = new Date();
  var timeDiff = targetDate - now;

  var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  var countdownElement = $("#countdown");
  countdownElement.html(
    "- 🕓 " +
      days +
      "일 " +
      hours +
      "시간 " +
      minutes +
      "분 " +
      seconds +
      "초 -"
  );
}

setInterval(updateCountdown, 1000);
