import { mainFrontendClient } from "../mainFrontendClient"

import { Course, CourseCount, Organization } from "@/shared-module/common/bindings"
import { isCourse, isOrganization } from "@/shared-module/common/bindings.guard"
import { isArray, validateResponse } from "@/shared-module/common/utils/fetching"
import { validateFile } from "@/shared-module/common/utils/files"

export const fetchOrganizations = async (): Promise<Array<Organization>> => {
  const response = await mainFrontendClient.get("/organizations")
  return validateResponse(response, isArray(isOrganization))
}

export const fetchOrganization = async (organizationId: string): Promise<Organization> => {
  const response = await mainFrontendClient.get(`/organizations/${organizationId}`)
  return validateResponse(response, isOrganization)
}

export const fetchOrganizationBySlug = async (organizationSlug: string): Promise<Organization> => {
  const res = await mainFrontendClient.get(`/org/${organizationSlug}`)
  return res.data
}

export const fetchOrganizationCourseCount = async (
  organizationId: string,
): Promise<CourseCount> => {
  const data = (await mainFrontendClient.get(`/organizations/${organizationId}/courses/count`, {}))
    .data
  return data
}

export const fetchOrganizationActiveCourseCount = async (
  organizationId: string,
): Promise<CourseCount> => {
  const data = (
    await mainFrontendClient.get(`/organizations/${organizationId}/courses/active/count`, {})
  ).data
  return data
}

export const fetchOrganizationCourses = async (
  organizationId: string,
  page: number,
  limit: number,
): Promise<Array<Course>> => {
  const response = await mainFrontendClient.get(`/organizations/${organizationId}/courses`, {
    params: {
      page,
      limit,
    },
  })
  return validateResponse(response, isArray(isCourse))
}

export const fetchOrganizationActiveCourses = async (
  organizationId: string,
  page: number,
  limit: number,
): Promise<Array<Course>> => {
  const response = await mainFrontendClient.get(`/organizations/${organizationId}/courses/active`, {
    params: {
      page,
      limit,
    },
  })
  return validateResponse(response, isArray(isCourse))
}

export const fetchOrganizationDuplicatableCourses = async (
  organizationId: string,
): Promise<Array<Course>> => {
  const response = await mainFrontendClient.get(
    `/organizations/${organizationId}/courses/duplicatable`,
  )
  return validateResponse(response, isArray(isCourse))
}

export const setOrganizationImage = async (
  organizationId: string,
  file: File,
): Promise<Organization> => {
  validateFile(file, ["image"])
  const data = new FormData()

  data.append("file", file, file.name || "unknown")
  const response = await mainFrontendClient.put(`/organizations/${organizationId}/image`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return validateResponse(response, isOrganization)
}

export const removeOrganizationImage = async (organizationId: string): Promise<void> => {
  await mainFrontendClient.delete(`/organizations/${organizationId}/image`)
}
