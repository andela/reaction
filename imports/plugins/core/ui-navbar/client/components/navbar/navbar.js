import { FlatButton } from "/imports/plugins/core/ui/client/components";
import { Reaction } from "/client/api";
import { Tags, Notifications, Pages } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { Dropdown } from "/imports/plugins/included/notifications/client/components";

const uid = Meteor.userId();
const sub = Meteor.subscribe("notificationList", uid);

Template.CoreNavigationBar.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    pages: []
  });

  this.autorun(() => {
    this.subscribe("Pages");
    this.state.set("pages", Pages.find().fetch());
  });
});

/**
 * layoutHeader events
 */
Template.CoreNavigationBar.events({
  "click .navbar-accounts .dropdown-toggle": function () {
    return setTimeout(function () {
      return $("#login-email").focus();
    }, 100);
  },
  "click .header-tag, click .navbar-brand": function () {
    return $(".dashboard-navbar-packages ul li").removeClass("active");
  },
  "click .search": function () {
    Blaze.renderWithData(Template.searchModal, {
    }, $("body").get(0));
    $("body").css("overflow", "hidden");
    $("#search-input").focus();
  }
});

Template.CoreNavigationBar.helpers({
  IconButtonComponent() {
    return {
      component: FlatButton,
      icon: "fa fa-search",
      kind: "flat"
    };
  },

  notificationButton() {
    const count = Notifications.find({ read: false }).fetch().length;
    const badge = (count) ? count + "" : "";
    return {
      component: FlatButton,
      icon: "fa fa-bell",
      kind: "flat",
      badge: badge
    };
  },

  onMenuButtonClick() {
    const instance = Template.instance();
    return () => {
      if (instance.toggleMenuCallback) {
        instance.toggleMenuCallback();
      }
    };
  },

  tagNavProps() {
    const instance = Template.instance();
    let tags = [];

    tags = Tags.find({
      isTopLevel: true
    }, {
        sort: {
          position: 1
        }
      }).fetch();

    return {
      name: "coreHeaderNavigation",
      editable: Reaction.hasAdminAccess(),
      isEditing: true,
      tags: tags,
      onToggleMenu(callback) {
        // Register the callback
        instance.toggleMenuCallback = callback;
      }
    };
  },

  notificationDropdown() {
    const list = Notifications.find({}, {sort: {time: -1}}).fetch();
    return {
      component: Dropdown,
      list: list
    };
  },
  showPages() {
    return Template.instance().state.get("pages");
  },
  pagesAvailable() {
    return Template.instance().state.get("pages").length > 0;
  }
});
