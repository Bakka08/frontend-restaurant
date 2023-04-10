function showPopup() {
			var popupContainer = document.getElementById("popup-container");
			popupContainer.style.display = "flex";
			
			// add event listener to the pop-up container to detect clicks outside of the square div
			popupContainer.addEventListener("click", function(event) {
				if (event.target === popupContainer) {
					// hide the pop-up container if the click was outside of the square div
					popupContainer.style.display = "none";
				}
			});
		}