var tn_block_ajax_data;
var tn_sub_cate_ajax;

jQuery(document).ready(function ($) {
    'use strict';

    //ajax next-prev
    $('.tn-ajax-prev').click(function (e) {
        e.preventDefault();
        var current_block;
        if ($(this).hasClass('tn-ajax-disable')) return;
        current_block = tn_get_current_block($(this).attr('id').slice(5));
        var offset = current_block.block_options.offset;
        var posts_per_page = current_block.block_options.posts_per_page;
        if (offset.length == 0) offset = 0;
        current_block.block_options.offset = parseInt(offset) - parseInt(posts_per_page);
        tn_ajax_block_request(current_block);
    });

    $('.tn-ajax-next').click(function (e) {
        e.preventDefault();
        var current_block;
        if ($(this).hasClass('tn-ajax-disable')) return;
        current_block = tn_get_current_block($(this).attr('id').slice(5));
        var offset = current_block.block_options.offset;
        var posts_per_page = current_block.block_options.posts_per_page;
        if (offset.length == 0) offset = 0;
        current_block.block_options.offset = parseInt(offset) + parseInt(posts_per_page);
        tn_ajax_block_request(current_block);
    });

    //ajax load more
    $('.tn-ajax-load-more').click(function (e) {
        e.preventDefault();
        var current_block;
        if ($(this).hasClass('tn-ajax-disable')) return;
        current_block = tn_get_current_block(this.id.slice(10));
        var offset = current_block.block_options.offset;
        var posts_per_page = current_block.block_options.posts_per_page;
        if (offset.length == 0) offset = 0;
        current_block.block_options.offset = parseInt(offset) + parseInt(posts_per_page);
        tn_ajax_block_request(current_block, true);
    });

    //ajax sub category
    if (tn_sub_cate_ajax == 1) {
        $('.tn-sub-cate-element a').click(function (e) {
            e.preventDefault();
            var current_block;
            var current_block_id = $(this).closest('.tn-block-wrap').attr('id');
            var sub_cate = $(this).attr('data-category-id');
            current_block = tn_get_current_block(current_block_id);
            current_block['block_options']['category_id'] = sub_cate;
            current_block['block_options']['category_ids'] = '';
            current_block['block_options']['offset'] = 0;
            tn_ajax_block_request(current_block);
        });
    }


    //ajax search
    $('#tn-ajax-form-search').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('ajax-search-hover');
        $(this).next().slideToggle(250);
    });
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
    $('#tn-search-form-text').keyup(function () {
        var value = $(this).val();
        delay(function () {
            if (value) {
                var search_class = $('#tn-ajax-search-result');
                search_class.fadeIn(300).html('<div class="search-loading"></div>');
                var data = {
                    action: 'tn_ajax_search',
                    s: value
                };
                $.post(tn_ajax_url, data, function (response) {
                    response = $.parseJSON(response);
                    $('#tn-ajax-search-result').empty().hide().css('height', 'auto').html(response.content).fadeIn(300).css('height', search_class.height());
                });
            } else  $('#tn-ajax-search-result').fadeOut(300, function () {
                $(this).empty().css('height', 'auto');
            });

        }, 450);
    });

    //ajax form login v2.0
    $('#login_button').on("click", function () {
        var user = $('#login_email').val();
        var password = $('#login_pass').val();
        $('#tn-login-error').hide().html('please wait...').fadeIn();
        jQuery.ajax({
            type: 'POST',
            url: tn_ajax_url,
            data: {
                action: 'tn_ajax_login',
                user: user,
                pass: password
            },
            success: function (data, textStatus, XMLHttpRequest) {
                var data_object = jQuery.parseJSON(data);

                if (data_object[0] == true) {
                    location.reload(true);
                } else {
                    $('#tn-login-error').html(data_object[1])
                }
            },
            error: function (MLHttpRequest, textStatus, errorThrown) {

            }
        });
        return false;
    });

    //register ajax
    $('#register_button').on("click", function () {
        var email = $('#register_email').val();
        var user = $('#register_user').val();
        $('#tn-register-error').hide().html('please wait...').fadeIn();
        jQuery.ajax({
            type: 'POST',
            url: tn_ajax_url,
            data: {
                action: 'tn_ajax_register',
                email: email,
                user: user
            },
            success: function (data, textStatus, XMLHttpRequest) {
                var data_object = jQuery.parseJSON(data);

                if (data_object[0] == true) {
                   $('.tn-register-inner').html(data_object[1])
                } else {
                    $('#tn-register-error').html(data_object[1])
                }
            },
            error: function (MLHttpRequest, textStatus, errorThrown) {

            }
        });
        return false;
    });

    //reset password
    $('#forgot_button').on("click", function () {
        var email = $('#forgot_email').val();
        $('#tn-forgot-error').hide().html('please wait...').fadeIn();
        jQuery.ajax({
            type: 'POST',
            url: tn_ajax_url,
            data: {
                action: 'tn_reset_password',
                email: email
            },
            success: function (data, textStatus, XMLHttpRequest) {
                var data_object = jQuery.parseJSON(data);

                if (data_object[0] == true) {
                    $('.tn-forgot-pass-inner').html(data_object[1])
                } else {
                    $('#tn-forgot-error').html(data_object[1])
                }
            },
            error: function (MLHttpRequest, textStatus, errorThrown) {

            }
        });
        return false;
    });

});

//get current block
function tn_get_current_block(id) {
    var data = '';

    jQuery.each(tn_block_ajax_data, function (index, block_data) {
        if (index == id) {
            data = block_data;
        }
    });
    return data;
}

//ajax request
function tn_ajax_block_request(block, append) {
    append = (typeof append === "undefined") ? false : append;

    //load from cache
    var current_block_cache = JSON.stringify(block);

    if (tn_cache.exist(current_block_cache)) {
        tn_ajax_animation_start(block, append);
        tn_ajax_block_response(tn_cache.get(current_block_cache), append);
        return 'cache';
    }

    //animation start
    tn_ajax_animation_start(block, append);

    //if missing cache
    jQuery.ajax({
        type: 'POST',
        url: tn_ajax_url,
        cache: true,
        data: {
            action: 'tn_ajax_block',
            block: block
        },

        success: function (data, textStatus, XMLHttpRequest) {
            tn_cache.set(current_block_cache, data);
            tn_ajax_block_response(data, append);
        },
        error: function (MLHttpRequest, textStatus, errorThrown) {
        }
    })
}

//ajax response
function tn_ajax_block_response(data, append) {
    var tn_data = jQuery.parseJSON(data);

    //load the content (in place or append)
    if (append === true) {
        jQuery('#' + tn_data.block_id).find('.tn-block-content-inner').append(tn_data.data_response); //load more
    } else {
        jQuery('#' + tn_data.block_id).find('.tn-block-content-inner').html(tn_data.data_response); //next prev
    }

    //hide or show prev
    if (tn_data.hide_prev === true) {
        jQuery('#prev_' + tn_data.block_id).addClass('tn-ajax-disable');
    } else {
        jQuery('#prev_' + tn_data.block_id).removeClass('tn-ajax-disable');
    }

    //hide or show next
    if (tn_data.hide_next === true) {
        jQuery('#next_' + tn_data.block_id).addClass('tn-ajax-disable');
    } else {
        jQuery('#next_' + tn_data.block_id).removeClass('tn-ajax-disable');
    }

    //hide load more
    if (tn_data.hide_next === true) {
        jQuery('#load-more-' + tn_data.block_id).closest('.tn-load-more-wrap').css('display', 'none');
    } else {
        jQuery('#load-more-' + tn_data.block_id).closest('.tn-load-more-wrap').css('display', 'block');
    }

    //loading effects
    imagesLoaded('body', function () {
        tn_ajax_animation_end(tn_data, append);
    })
}

//ajax animation start
function tn_ajax_animation_start(block, append) {
    var tn_block_inner = jQuery('#' + block.block_id).find('.tn-block-content-inner');
    var tn_loader = '<div class="tn-loader"></div>';
    jQuery('.tn-loader').remove();
    tn_block_inner.stop();
    tn_block_inner.fadeTo('600', 0.1, 'easeInOutCubic', function () {
        tn_block_inner.parent('.tn-block-content-wrap').append(tn_loader);
    });
    if (append == true) {
        jQuery('#load-more-' + block.block_id).html('Loading...');
    }
    var block_height = tn_block_inner.height();
    tn_block_inner.addClass('block_inner_overflow').css('height', block_height);
}

//ajax animation end
function tn_ajax_animation_end(tn_data, append) {
    jQuery(this).delay(100).queue(function () {
        jQuery('.tn-loader').remove();
        var block_inner = jQuery('#' + tn_data.block_id).find('.tn-block-content-inner');
        block_inner.stop();
        block_inner.css('height', 'auto');
        block_inner.fadeTo(600, 1, function () {
            if (append == true) {
                jQuery('#' + tn_data.block_id).find('.tn-ajax-load-more').html('load more');
            }
            block_inner.removeClass('block_inner_overflow');
        });
        imagesLoaded('body', function () {
            jQuery(".tn-sidebar-wrap").trigger("sticky_kit:recalc");
        });
        jQuery(this).dequeue();
    });
}

//cache ajax
var tn_cache = {
    data: {},
    get: function (id) {
        return tn_cache.data[id];
    },
    set: function (id, cache_data) {
        tn_cache.remove(id);
        tn_cache.data[id] = cache_data;
    },
    remove: function (id) {
        delete tn_cache.data[id];
    },
    exist: function (id) {
        return tn_cache.data.hasOwnProperty(id) && tn_cache.data[id] !== null;
    }
};