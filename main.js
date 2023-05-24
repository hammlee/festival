/** @format */

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
    "(" + days + "일 " + hours + "시간 " + minutes + "분 " + seconds + "초 ⏰)"
  );
}

setInterval(updateCountdown, 1000);

// 모바일 기기에서 접속한지 여부를 화면 사이즈로 확인하는 함수
function isMobileDevice() {
  const mobileWidthThreshold = 600; // 모바일 기기로 간주할 최대 너비

  return window.innerWidth < mobileWidthThreshold;
}

// 작품 불러오기
$(document).ready(function () {
  var cardContainer = $(".swiper-wrapper");
  var cardContainer2 = $(".swiper-wrapper2");
  cardContainer.html(
    '<div class="loading-text text-center"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>'
  );
  cardContainer2.html(
    '<div class="loading-text text-center"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>'
  );

  $.getJSON(
    "https://script.google.com/macros/s/AKfycbyMEu2h2AN7ob9oISsmDJuUBbwsB2AnwKhQpR9lJ8vBtvS3NNIXEtRrY41QEHjc4SDL_w/exec?function=doGet",
    function (data) {
      cardContainer.empty();
      cardContainer2.empty();
      var totalCount = "전체 " + String(data.length + 1) + "건";
      $("#content-count").text(totalCount);

      var dataWithLikes = data.filter((item) => item.likeCount > 0);
      var dataWithoutLikes = data;

      dataWithLikes.sort((a, b) => b.likeCount - a.likeCount);
      dataWithoutLikes.sort((a, b) => b.id - a.id);

      var rank = 1;
      var previousLikeCount = -1;
      var count = 0;

      dataWithLikes.forEach((item) => {
        var cardText = item.text ? item.text.replace(/\r\n/g, "<br>") : "";
        var cardRank = "";

        if (item.likeCount === previousLikeCount) {
          count++;
        } else {
          rank += count;
          count = 1;
        }

        cardRank = "현재 " + rank + "위";
        previousLikeCount = item.likeCount;

        var card = `
          <div class="swiper-slide">
            <div class="card card-black">
              <div class="card-badge">${item.id}</div>
              ${cardRank ? `<div class="card-rank">${cardRank}</div>` : ""}
              <div class="card-body">
                <p class="card-text">${cardText}</p>
              </div>
              <div class="card-footer">
                <div>
                  <span class="icon-wrapper">
                    <i class="fas fa-thumbs-up"></i>
                  </span>
                  <span class="like-count">${item.likeCount}</span>
                </div>
                <h5 class="card-name">from <span class="card-name-from">${
                  item.name
                }</span></h5>
              </div>
            </div>
          </div>
        `;

        cardContainer.append(card);
        cardContainer2.append(card);
      });

      dataWithoutLikes.forEach((item) => {
        var cardText = item.text ? item.text.replace(/\r\n/g, "<br>") : "";

        var card = `
          <div class="card card-black col-md-6 mb-4">
            <div class="card-badge">${item.id}</div>
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
              <h5 class="card-name">from <span class="card-name-from">${item.name}</span></h5>
            </div>
          </div>
        `;

        $(".card-container").append(card);
      });

      var swiper = new Swiper(".swiper-container", {
        direction: "horizontal",
        // loop: true,
        slidesPerView: 2,
        spaceBetween: 10,
        autoplay: {
          delay: 0, // 슬라이드 간격 (밀리초)
          disableOnInteraction: true // 사용자 상호작용 시 중지 여부
        },
        speed: 12000
      });

      var swiper2 = new Swiper(".swiper-container2", {
        direction: "horizontal",
        slidesPerView: 1,
        spaceBetween: 10
      });
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
    success: function (response) {
      alert("제출이 완료되었습니다.");
      location.reload();
    },
    error: function (error) {
      alert("제출에 실패했습니다. 다시 시도해주세요.");
    }
  });
});
