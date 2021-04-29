/*!
Handlers for HTTP requests to `/api/v0/cms/cms`.

This documents all endpoints. Select a module below for a category.

*/

pub mod course_parts;
pub mod courses;
pub mod organizations;
pub mod pages;

use actix_web::web::{self, ServiceConfig};

use self::{
    course_parts::_add_course_parts_routes, courses::_add_courses_routes,
    organizations::_add_organizations_routes, pages::_add_pages_routes,
};

/// Add controllers from all the submodules.
pub fn add_cms_routes(cfg: &mut ServiceConfig) {
    cfg.service(web::scope("/courses").configure(_add_courses_routes))
        .service(web::scope("/pages").configure(_add_pages_routes))
        .service(web::scope("/organizations").configure(_add_organizations_routes))
        .service(web::scope("/course-parts").configure(_add_course_parts_routes));
}
