// 버튼 요소들을 가져옵니다.
const buttons = document.querySelectorAll('.classic, .random, .reverse');
const prob_text = document.querySelector('.prob_text');
const outputElements = [
    [document.querySelector('.draw_number11'), document.querySelector('.draw_number12'), document.querySelector('.draw_number13'), document.querySelector('.draw_number14'), document.querySelector('.draw_number15'), document.querySelector('.draw_number16')],
    [document.querySelector('.draw_number21'), document.querySelector('.draw_number22'), document.querySelector('.draw_number23'), document.querySelector('.draw_number24'), document.querySelector('.draw_number25'), document.querySelector('.draw_number26')],
    [document.querySelector('.draw_number31'), document.querySelector('.draw_number32'), document.querySelector('.draw_number33'), document.querySelector('.draw_number34'), document.querySelector('.draw_number35'), document.querySelector('.draw_number36')],
    [document.querySelector('.draw_number41'), document.querySelector('.draw_number42'), document.querySelector('.draw_number43'), document.querySelector('.draw_number44'), document.querySelector('.draw_number45'), document.querySelector('.draw_number46')],
    [document.querySelector('.draw_number51'), document.querySelector('.draw_number52'), document.querySelector('.draw_number53'), document.querySelector('.draw_number54'), document.querySelector('.draw_number55'), document.querySelector('.draw_number56')]
];  
// 각 버튼에 클릭 이벤트 리스너를 등록합니다.
buttons.forEach(button => {
    button.addEventListener('click', function() {
        // 현재 클릭된 버튼을 제외한 모든 버튼에서 'clicked' 클래스를 제거합니다.
        buttons.forEach(btn => {
            if (btn !== this) {
                btn.classList.remove('clicked');
            }
        });

        // 현재 클릭된 버튼에 'clicked' 클래스를 토글링합니다.
        this.classList.toggle('clicked');

        // 클릭된 버튼에 따라 텍스트를 변경합니다.
        if (this.classList.contains('classic')) {
            prob_text.textContent = "클래식! 역대 당첨 번호의 출현 확률을 반영한 번호 추첨";
        } else if (this.classList.contains('random')) {
            prob_text.textContent = "랜덤! 순수 랜덤 번호 추첨";
        } else if (this.classList.contains('reverse')) {
            prob_text.textContent = "리버스! 역대 당첨된 번호의 출현 확률을 역으로 반영한 번호 추첨";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // 퀵드로우 버튼 클릭 시 처리
    const quickDrawButton = document.querySelector('.quick_draw');
    
    quickDrawButton.addEventListener('click', async function () {
        // 1. 추출 방법과 번호군 선택
        const extractionMethod = getExtractionMethod();
        const selectedGroups = getSelectedNumberGroups();

        if (extractionMethod === null) {
            alert("추출 방법을 선택하세요.");
            return;
        }

        // 2. 선택된 데이터 서버로 전송
        const data = {
            method: extractionMethod,
            selected_groups: selectedGroups
        };
        console.log("서버로 전송할 데이터:", data);

        const lottoNumbers = document.querySelectorAll('.lottonumber_container span');
        lottoNumbers.forEach(span => {
            span.style.opacity = '0.05';
        });

        try {
            const response = await fetch("https://port-0-flask-m3d4ham70c976746.sel4.cloudtype.app/api/numbers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            // 3. 서버에서 번호 추출 후 반환
            const result = await response.json();
            console.log("서버 응답 데이터:", result);
            const numbers = result.numbers;

            // 4. 추출된 번호를 프론트엔드에 표시
            displayNumbers(numbers);
            // 0.5초마다 opacity를 증가시키며 점진적으로 보이도록 설정
            lottoNumbers.forEach(span => {
                    span.style.backgroundColor = '#ddd';
                    span.style.transition = 'opacity 0.5s ease';
                    span.style.opacity = '1'; // fade-in 효과
            });
            updateShapeColors(numbers);
        } catch (error) {
            console.error("서버 오류:", error);
        } 
    });

    // 추출 방법 선택 (클래스 기반 선택)
    function getExtractionMethod() {
        const classicButton = document.querySelector('.classic');
        const randomButton = document.querySelector('.random');
        const reverseButton = document.querySelector('.reverse');
        
        if (classicButton && classicButton.classList.contains('clicked')) return 1;
        if (randomButton && randomButton.classList.contains('clicked')) return 2;
        if (reverseButton && reverseButton.classList.contains('clicked')) return 3;
        
        return null;
    }

    // 선택된 번호군
    function getSelectedNumberGroups() {
        const selectedGroups = [];
        if (document.getElementById("first").checked) selectedGroups.push([1, 10]);
        if (document.getElementById("second").checked) selectedGroups.push([11, 20]);
        if (document.getElementById("third").checked) selectedGroups.push([21, 30]);
        if (document.getElementById("forth").checked) selectedGroups.push([31, 40]);
        if (document.getElementById("fifth").checked) selectedGroups.push([41, 45]);
        return selectedGroups;
    }

    // 번호를 화면에 표시
    function displayNumbers(numbers) {
        console.log("디스플레이할 번호:", numbers);
        const lottoNumbers = document.querySelectorAll('.lottonumber_container span');
        lottoNumbers.forEach((span, index) => {
            if (numbers[index]) {
                span.textContent = numbers[index].toString().padStart(2, '0');
            } else {
                span.textContent = '00';
            }
        });
    }
    
    const rangeColorMap = [
      { min: 1, max: 10, color: '#fbc400' },
        { min: 11, max: 20, color: '#69c8f2' },
        { min: 21, max: 30, color: '#ff7272' },
        { min: 31, max: 40, color: '#aaa' },
        { min: 41, max: 45, color: '#b0d840' }
    ];

    // 번호에 따라 색상을 업데이트하는 함수
    function updateShapeColors(numbers) {
        const shapeElements = document.querySelectorAll('.lotto_number1,.lotto_number2,.lotto_number3,.lotto_number4,.lotto_number5,.lotto_number6'); // 원형 도형 요소를 선택합니다.

        // 번호를 기준으로 색상을 결정하는 함수
        function getColorForNumber(number) {
            const range = rangeColorMap.find(r => number >= r.min && number <= r.max);
            return range ? range.color : '#ddd'; // 색상이 정의되지 않은 경우 기본색으로 흰색 설정
        }

        // 원형 도형 색상 업데이트
        shapeElements.forEach((el, index) => {
            const number = numbers[index];
            el.style.backgroundColor = getColorForNumber(number);
        });
    }        
    // 번호를 리셋하는 함수
    function resetDraw() {
        clickCount = 0; // 클릭 횟수 초기화
        const lottoNumbers = document.querySelectorAll('.lottonumber_container span');
        lottoNumbers.forEach(el => el.textContent = "00"); // 결과 요소 비우기
        // 버튼 상태 초기화
        buttons.forEach(button => {
            button.classList.remove('clicked'); // 모든 버튼에서 'clicked' 클래스 제거
        });
       // 확률 텍스트 초기화 (필요한 경우)
        prob_text.textContent = "확률을 다시 선택해주세요."; // 확률 텍스트 초기화 (필요에 따라 수정)
        resetColor();
        // 추가적으로 필요한 초기화 작업을 여기에 추가
        // 예를 들어, 체크박스 선택 해제 등
    }

    function resetColor() {
        // 색상을 초기화할 원형 도형 요소들을 선택합니다.
        const colorCircles = document.querySelectorAll('.lotto_number1,.lotto_number2,.lotto_number3,.lotto_number4,.lotto_number5,.lotto_number6');

        // 모든 원형 도형의 색상을 기본 색상으로 리셋합니다.
        colorCircles.forEach(circle => {
            circle.style.backgroundColor = ' #ddd'; // 기본 색상 (예: 흰색)
        });
    }

    const saveNumberButton = document.querySelector('.save_number')
    saveNumberButton.addEventListener('click', function() {
        const lottoNumbers = Array.from(document.querySelectorAll('.lottonumber_container span')); // NodeList를 Array로 변환
        const numbersToSave = lottoNumbers.map(el => el.textContent);
        if (numbersToSave.includes('00')) {
            return;
        }

        const emptyOutputSet = outputElements.find(set => set.every(el => el.textContent === '00'));
        if (emptyOutputSet) {
            numbersToSave.sort((a, b) => a - b).forEach((number, index) => {
                emptyOutputSet[index].textContent = number;
            });
            lottoNumbers.forEach(el => el.textContent = '00');
            clickCount = 0;
        }
        resetColor();
    });
    
    const deleteNumberButton = document.querySelector('.reset')
    deleteNumberButton.addEventListener('click', function() {
        for (let i = outputElements.length - 1; i >= 0; i--) {
            if (outputElements[i].some(el => el.textContent !== '00')) {
                outputElements[i].forEach(el => el.textContent = '00');
                break;
            }
        }
    });
});


// 버튼 요소를 가져옵니다.
const luckyDrawButton = document.querySelector('.quick_draw');
const triggerLuckyDrawBlinkButton = document.querySelector('.effect');
const addbox = document.querySelector('.ad_box1');

// 클릭 횟수를 추적할 변수 (블링크용)
let blinkingClickCount = 0;

// 블링크 패턴 클래스 리스트
const blinkClasses = [
    { lucky: 'blinking1', addbox: 'blinking1-1' },
    { lucky: 'blinking2', addbox: 'blinking2-1' },
    { lucky: 'blinking3', addbox: 'blinking3-1' }
];

// 럭키드로우 블링크
triggerLuckyDrawBlinkButton.addEventListener('click', function() {
    // 현재 블링크 클래스 인덱스
    const currentBlinkClassIndex = blinkingClickCount % (blinkClasses.length + 1);

    // 모든 블링크 클래스를 제거
    blinkClasses.forEach(blinkClass => {
        luckyDrawButton.classList.remove(blinkClass.lucky);
        addbox.classList.remove(blinkClass.addbox);
    });

    // 블링크 클래스가 적용될 인덱스가 패턴 리스트의 길이보다 작을 경우에만 적용
    if (currentBlinkClassIndex < blinkClasses.length) {
        const newBlinkClass = blinkClasses[currentBlinkClassIndex];
        luckyDrawButton.classList.add(newBlinkClass.lucky);
        addbox.classList.add(newBlinkClass.addbox);
    }

    // 클릭 횟수 증가
    blinkingClickCount++;
});


// 페이지 로드 시 팝업 열기
window.onload = function() {
    openPopup();
};

// 팝업 열기 함수
function openPopup() {
    document.querySelector('.popup').style.display = 'block';
    document.querySelector('.popup-overlay').style.display = 'block';
}

// 팝업 닫기 함수
function closePopup() {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.popup-overlay').style.display = 'none';
}

// 닫기 버튼에 클릭 이벤트 리스너 추가
document.querySelector('.close-btn').addEventListener('click', closePopup);

// 버튼 클릭 시 페이지 토글
const pageShiftButton = document.querySelector(".page_shift");
const newContent = document.getElementById("new_content");

pageShiftButton.addEventListener("click", function () {
    if (newContent.classList.contains("hidden")) {
        newContent.classList.remove("hidden");
        newContent.classList.add("visible");
    } else {
        newContent.classList.remove("visible");
        newContent.classList.add("hidden");
    }
});