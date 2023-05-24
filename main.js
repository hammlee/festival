/** @format */

// 작품 불러오기
$(document).ready(function () {
  var cardContainer = $(".card-container");
  cardContainer.html(
    '<div class="loading-text">작품을 불러오고 있습니다...</div>'
  );

  $.getJSON(
    "https://script.google.com/macros/s/AKfycbwk7OzL0yQuNh0Y7LR1gUvcfVvN7Kn7czh8uqH4qjFwqm5DOFCS4glAKskvNuQuCcZxIg/exec?function=doGet",
    function (data) {
      cardContainer.empty();
      var totalCount = String(data.length + 1) + "건";
      $("#content-count").text(totalCount);

      for (var i = data.length - 1; i >= 0; i--) {
        var item = data[i];
        var cardText = item.text ? item.text.replace(/\r\n/g, "<br>") : "";

        var card = `
          <div class="col-md-6 col-lg-4 mb-3">
            <div class="card card-black">
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
          </div>
        `;
        cardContainer.append(card);
      }
    }
  );
});

$(document).on("click", ".recommend-button", function () {
  var cardName = $(this).closest(".card-footer").find(".card-name-from").text();

  alert(
    cardName + "님의 작품을 추천하셨습니다. (좋아요 카운트는 아직 구현중..)"
  );
  var selectedButton = $(this);
  selectedButton.removeClass("selected");
});

$("form").submit(function (event) {
  event.preventDefault();
  $.ajax({
    url: "https://script.google.com/macros/s/AKfycbwk7OzL0yQuNh0Y7LR1gUvcfVvN7Kn7czh8uqH4qjFwqm5DOFCS4glAKskvNuQuCcZxIg/exec?function=doPost",
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
