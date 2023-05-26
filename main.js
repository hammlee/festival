/** @format */
const targetDate = new Date("2023-05-28T23:59:59");

const TIME_FORMATS = [24, 60, 60, 1000];

const updateCountdown = () => {
  const timeDiff = targetDate - new Date();

  let tempTime = timeDiff;
  const timeParts = TIME_FORMATS.map((time) => {
    tempTime = tempTime / time;
    return Math.floor(tempTime % time);
  });

  const [days, hours, minutes, seconds] = timeParts.reverse();
  $("#countdown").html(`(${days}일 ${hours}시간 ${minutes}분 ${seconds}초 ⏰)`);
};

setInterval(updateCountdown, 1000);

const isMobileDevice = () => window.innerWidth < 600;

$(document).ready(function () {
  const cardContainer = $(".swiper-wrapper");
  const cardContainer2 = $(".swiper-wrapper2");
  const loadingText =
    '<div class="loading-text text-center"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>';
  cardContainer.html(loadingText);
  cardContainer2.html(loadingText);

  const ajaxSettings = {
    url: "https://script.google.com/macros/s/AKfycbyMEu2h2AN7ob9oISsmDJuUBbwsB2AnwKhQpR9lJ8vBtvS3NNIXEtRrY41QEHjc4SDL_w/exec",
    success: updateCards,
    error: () => alert("추천에 실패했습니다. 잠시 후에 다시 시도해주세요.")
  };

  $.ajax({ ...ajaxSettings, method: "GET", data: { function: "doGet" } });

  $(document).on("click", ".recommend-button", function (event) {
    event.preventDefault();
    const id = $(this).closest(".card-black").find(".card-badge").text();
    $.ajax({
      ...ajaxSettings,
      method: "POST",
      data: { functionName: "increaseLikeCount", id }
    });
  });

  $("form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      ...ajaxSettings,
      method: "POST",
      data: $("form").serialize()
    });
  });
});

function updateCards(data) {
  $(".swiper-wrapper, .swiper-wrapper2").empty();
  $("#content-count").text(`전체 ${data.length + 1}건`);

  const [dataWithLikes, dataWithoutLikes] = [
    data.filter((item) => item.likeCount > 0),
    [...data]
  ];
  dataWithLikes.sort((a, b) => b.likeCount - a.likeCount);
  dataWithoutLikes.sort((a, b) => b.id - a.id);

  updateCard(dataWithLikes, ".swiper-wrapper, .swiper-wrapper2", true);
  updateCard(dataWithoutLikes, ".card-container");

  initSwiper(".swiper-container", 2);
  initSwiper(".swiper-container2", 1);
}

function updateCard(data, target, hasRank = false) {
  let rank = 1;
  let previousLikeCount = -1;
  let count = 0;

  for (const item of data) {
    if (hasRank) {
      if (item.likeCount === previousLikeCount) {
        count++;
      } else {
        rank += count;
        count = 1;
      }
      previousLikeCount = item.likeCount;
    }

    const cardText = item.text ? item.text.replace(/\r\n/g, "<br>") : "";
    const card = createCardTemplate(item, cardText, hasRank ? rank : null);

    $(target).append(card);
  }
}

function createCardTemplate(item, cardText, rank) {
  const rankHtml = rank ? `<div class="card-rank">${rank}</div>` : "";
  return `<div class="swiper-slide">
  <div class="card card-black">
    <div class="card-badge">${item.id}</div>
    ${rankHtml}
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
      <h5 class="card-name">from <span class="card-name-from">${item.name}</span></h5>
    </div>
  </div>
</div>`;
}

function initSwiper(target, slidesPerView) {
  new Swiper(target, {
    direction: "horizontal",
    slidesPerView,
    spaceBetween: 10,
    autoplay: {
      delay: 0,
      disableOnInteraction: true
    },
    speed: 12000
  });
}