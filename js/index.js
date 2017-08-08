$("#applyBtn").on("click",function(){
  alert('Thanks for viewing!');
});

/* custom binding handler by http://www.hughanderson.com/ */
ko.bindingHandlers.slider = {
  init: function(element, valueAccessor) {
    // use setTimeout with 0 to run this after Knockout is done
    setTimeout(function() {
      // $(element) doesn't work as that has been removed from the DOM
      var curSlider = $("#" + element.id);
      // helper function that updates the slider and refreshes the thumb location
      function setSliderValue(newValue) {
        curSlider.val(newValue).slider("refresh");
      }
      // subscribe to the bound observable and update the slider when it changes
      valueAccessor().subscribe(setSliderValue);
      // set up the initial value, which of course is NOT stored in curSlider, but the original element :\
      setSliderValue($(element).val());
      // subscribe to the slider's change event and update the bound observable
      curSlider.bind("change", function() {
        valueAccessor()(curSlider.val());
      });
    }, 0);
  }
};

// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
Date.prototype.addDays = function(days) {
  this.setDate(this.getDate() + parseInt(days));
  return this;
};

// http://www.webdevelopersnotes.com/getting-current-time-using-javascript
// #5
function getDateInRequiredFormat(durationOfBorrow) {
  var d_names = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );

  var m_names = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );

  var d = new Date();
  d.addDays(durationOfBorrow);
  //alert(d);
  var curr_day = d.getDay();
  var curr_date = d.getDate();
  var sup = "";
  if (curr_date == 1 || curr_date == 21 || curr_date == 31) {
    sup = "st";
  } else if (curr_date == 2 || curr_date == 22) {
    sup = "nd";
  } else if (curr_date == 3 || curr_date == 23) {
    sup = "rd";
  } else {
    sup = "th";
  }
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();

  return (
    d_names[curr_day] +
    " " +
    curr_date +
    "<SUP>" +
    sup +
    "</SUP> " +
    m_names[curr_month] +
    " " +
    curr_year
  );
}

function AppViewModel() {
  this.currentAmount = ko.observable(111);
  this.currentPeriod = ko.observable(11);

  this.tillDate = ko.computed(function() {
    return "(" + getDateInRequiredFormat(this.currentPeriod()) + ")";
  }, this);

  this.summaryBorrowed = ko.computed(function() {
    return "Borrowing" + "<br> £" + this.currentAmount();
  }, this);

  this.interestRepaid = ko.computed(function() {
    return (
      "Interest" +
      "<br> £" +
      (this.currentAmount() * 0.8 / 100 * this.currentPeriod()).toFixed(2)
    );
  }, this);

  this.totalRepaid = ko.computed(function() {
    var total = (this.currentAmount() *
      (1 + 0.8 / 100 * this.currentPeriod())).toFixed(2);
    return "Total to repay" + "<br> £" + total;
  }, this);

  this.reducePeriodVal = function() {
    if (parseInt(this.currentPeriod()) > 1) {
      this.currentPeriod(parseInt(this.currentPeriod()) - 1);
    }
  };

  this.increasePeriodVal = function() {
    if (parseInt(this.currentPeriod()) < 35) {
      this.currentPeriod(parseInt(this.currentPeriod()) + 1);
    }
  };

  this.reduceAmountVal = function() {
    if (parseInt(this.currentAmount()) > 50) {
      this.currentAmount(parseInt(this.currentAmount()) - 1);
    }
  };

  this.increaseAmountVal = function() {
    if (parseInt(this.currentAmount()) < 400) {
      this.currentAmount(parseInt(this.currentAmount()) + 1);
    }
  };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

//https://github.com/stuartchaney/bootstrap3-money-field
$(function() {
  var options = {
    width: 70,
    symbol: "£"
  };
  $(".amount").money_field(options);

  var options2 = {
    width: 50,
    symbol: "days"
  };
  $(".period").days_field(options2);
});

(function($) {
  $.fn.money_field = function(opts) {
    var defaults = { width: null, symbol: "£" };
    var opts = $.extend(defaults, opts);
    return this.each(function() {
      if (opts.width) $(this).css("width", opts.width + "px");
      $(this)
        .wrap("<div class='input-group'>")
        .before("<span class='input-group-addon'>" + opts.symbol + "</span>");
    });
  };

  $.fn.days_field = function(opts) {
    var defaults = { width: null, symbol: "days" };
    var opts = $.extend(defaults, opts);
    return this.each(function() {
      if (opts.width) $(this).css("width", opts.width + "px");
      $(this)
        .wrap("<div class='input-group'>")
        .after("<span class='input-group-addon'>" + opts.symbol + "</span>");
    });
  };
})(jQuery);
