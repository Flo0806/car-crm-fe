import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import TheOverview from "@/views/TheOverview.vue";

// Mocking von useRouter und useAuthStore
const mockPush = vi.fn();
const mockLogout = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({
    email: "test@example.com",
    logout: mockLogout,
  }),
}));

describe("Overview.vue Unit Tests", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(TheOverview, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub, // Stubbing von router-link
        },
      },
    });
  });

  it("renders the email from the store", () => {
    const emailElement = wrapper.find("h2");
    expect(emailElement.text()).toBe("test@example.com"); // Überprüft, ob die E-Mail korrekt gerendert wird
  });

  it("calls handleLogout and redirects to /login on logout", async () => {
    const logoutButton = wrapper.find(".btn-error");
    await logoutButton.trigger("click");

    expect(mockLogout).toHaveBeenCalled(); // Überprüft, ob logout aufgerufen wurde
    expect(mockPush).toHaveBeenCalledWith("/login"); // Überprüft, ob der Benutzer nach /login weitergeleitet wurde
  });
});
